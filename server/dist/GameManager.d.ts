import { WebSocket } from "ws";
import { User } from "./SocketManager.js";
export declare class GameManger {
    private games;
    private pendingGameId;
    private users;
    constructor();
    addUser(user: User): void;
    removeUser(socket: WebSocket): void;
    removeGame(gameId: string): void;
    private addHandler;
}
//# sourceMappingURL=GameManager.d.ts.map