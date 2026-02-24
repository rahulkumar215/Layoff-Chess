import WebSocket from "ws";
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({
    port: 5000,
});
const allSockets = [];
wss.on("connection", (socket) => {
    console.log("User Connected");
    if (!allSockets.includes(socket)) {
        allSockets.push(socket);
    }
    socket.on("message", (message) => {
        const parseMessage = JSON.parse(message);
        allSockets.forEach((s) => {
            s.send(JSON.stringify(parseMessage));
        });
    });
});
//# sourceMappingURL=index.js.map