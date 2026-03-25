import app from "./app.js";
import http from "http";
import appConfig from "./config/appConfig.js";
import { WebSocketServer } from "ws";
import url from "url";
import { extractAuthUser } from "./SocketManager.js";
import { GameManger } from "./GameManager.js";
import { prisma } from "./config/prisma.js";

const { PORT } = appConfig;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const gameManager = new GameManger();

server.on("upgrade", (req, ws, head) => {
  console.log("Server upgraded");
  console.log("Req: ", req);
  console.log("WebSocket", ws);
  console.log("Headers", head);
});

wss.on("connection", (ws, req) => {
  console.log("New Client Connected");

  const parsedUrl = url.parse(req.url ?? "", true);
  const tokenParam = parsedUrl.query.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    ws.close(1008, "Missing auth token");
    return;
  }

  const user = extractAuthUser(token, ws);
  gameManager.addUser(user);

  ws.send("Welcome to WebSocket Server");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    ws.send("You said: " + message);
  });

  ws.on("close", () => {
    console.log("Client diconnected");
  });
});

// const server = app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
prisma.$connect().then(() => console.log("Database connected"));
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// process.on("unhandledRejection", (err: any) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("uncaughtException", (err: any) => {
//   console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//   console.error(err.name, err.message);
//   process.exit(1);
// });
