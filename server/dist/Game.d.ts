import { Chess, Move } from "chess.js";
import type { Square } from "chess.js";
import { User } from "./SocketManager.js";
type GAME_STATUS = "IN_PROGRESS" | "COMPLETED" | "ABANDONED" | "TIME_UP" | "PLAYER_EXIT";
type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export declare function isPromoting(chess: Chess, from: Square, to: Square): boolean;
export declare class Game {
    gameId: string;
    player1UserId: string;
    player2UserId: string | null;
    board: Chess;
    private moveCount;
    private timer;
    private moveTimer;
    result: GAME_RESULT | null;
    private player1TimeConsumed;
    private player2TimeConsumed;
    private startTime;
    private lastMoveTime;
    constructor(player1UserId: string, player2UserId: string | null, gameId?: string, startTime?: Date);
    seedMoves(moves: {
        id: string;
        gameId: string;
        moveNumber: number;
        from: string;
        to: string;
        comments: string | null;
        timeTaken: number | null;
        createdAt: Date;
    }[]): void;
    updateSecondPlayer(player2UserId: string): Promise<void>;
    createGameInDb(): Promise<void>;
    addMoveToDb(move: Move, moveTimestamp: Date): Promise<void>;
    makeMove(user: User, move: Move): Promise<void>;
    getPlayer1TimeConsumed(): number;
    getPlayer2TimeConsumed(): number;
    resetAbandonedTimer(): Promise<void>;
    resetMoveTimer(): Promise<void>;
    exitGame(user: User): Promise<void>;
    endGame(status: GAME_STATUS, result: GAME_RESULT): Promise<void>;
    clearMoveTimer(): void;
    setTimer(timer: NodeJS.Timeout): void;
    clearTimer(): void;
}
export {};
//# sourceMappingURL=Game.d.ts.map