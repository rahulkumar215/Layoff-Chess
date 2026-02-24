import WebSocket from "ws";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 5000,
});

const allSockets: WebSocket[] = [];

wss.on("connection", (socket: WebSocket) => {
  console.log("User Connected");

  if (!allSockets.includes(socket)) {
    allSockets.push(socket);
  }

  socket.on("message", (message: string) => {
    const parseMessage = JSON.parse(message);

    allSockets.forEach((s) => {
      s.send(JSON.stringify(parseMessage));
    });
  });
});
