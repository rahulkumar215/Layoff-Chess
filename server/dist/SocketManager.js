import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import appConfig from "./config/appConfig.js";
import { randomUUID } from "crypto";
const { JWT_SECRET } = appConfig;
export const extractAuthUser = (token, ws) => {
    const decode = jwt.verify(token, JWT_SECRET);
    return new User(ws, decode);
};
export class User {
    socket;
    id;
    userId;
    name;
    role;
    constructor(socket, userJwtClaims) {
        this.socket = socket;
        this.userId = userJwtClaims.userId;
        this.id = randomUUID();
        this.name = userJwtClaims.name;
        this.role = userJwtClaims.role;
    }
}
class SocketManager {
    static instance;
    interestedSockets;
    userRoomMapping;
    constructor() {
        this.interestedSockets = new Map();
        this.userRoomMapping = new Map();
    }
    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance;
        }
        SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }
    addUser(user, roomId) {
        this.interestedSockets.set(roomId, [
            ...(this.interestedSockets.get(roomId) || []),
            user,
        ]);
        this.userRoomMapping.set(user.userId, roomId);
    }
    broadcast(roomId, message) {
        const users = this.interestedSockets.get(roomId);
        if (!users) {
            console.error("No users in room?");
            return;
        }
        users.forEach((user) => {
            user.socket.send(message);
        });
    }
    removeUser(user) {
        const roomId = this.userRoomMapping.get(user.userId);
        if (!roomId) {
            console.error("User was not interested in any room?");
            return;
        }
        const room = this.interestedSockets.get(roomId) || [];
        const remainingUsers = room.filter((u) => u.userId !== user.userId);
        this.interestedSockets.set(roomId, remainingUsers);
        if (this.interestedSockets.get(roomId)?.length === 0) {
            this.interestedSockets.delete(roomId);
        }
        this.userRoomMapping.delete(user.userId);
    }
}
export const socketManager = SocketManager.getInstance();
//# sourceMappingURL=SocketManager.js.map