import { WebSocket } from "ws";
export interface userJwtClaims {
    userId: string;
    name: string;
    role: string;
}
export declare const extractAuthUser: (token: string, ws: WebSocket) => User;
export declare class User {
    socket: WebSocket;
    id: string;
    userId: string;
    name: string;
    role: string;
    constructor(socket: WebSocket, userJwtClaims: userJwtClaims);
}
declare class SocketManager {
    private static instance;
    private interestedSockets;
    private userRoomMapping;
    private constructor();
    static getInstance(): SocketManager;
    addUser(user: User, roomId: string): void;
    broadcast(roomId: string, message: string): void;
    removeUser(user: User): void;
}
export declare const socketManager: SocketManager;
export {};
//# sourceMappingURL=SocketManager.d.ts.map