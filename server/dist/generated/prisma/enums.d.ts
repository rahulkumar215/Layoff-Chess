export declare const GameStatus: {
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly ABANDONED: "ABANDONED";
    readonly TIME_UP: "TIME_UP";
    readonly PLAYER_EXIT: "PLAYER_EXIT";
};
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];
export declare const GameResult: {
    readonly WHITE_WINS: "WHITE_WINS";
    readonly BLACK_WINS: "BLACK_WINS";
    readonly DRAW: "DRAW";
};
export type GameResult = (typeof GameResult)[keyof typeof GameResult];
export declare const TimeControl: {
    readonly CLASSICAL: "CLASSICAL";
    readonly RAPID: "RAPID";
    readonly BLITZ: "BLITZ";
    readonly BULLET: "BULLET";
};
export type TimeControl = (typeof TimeControl)[keyof typeof TimeControl];
export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
    readonly GUEST: "GUEST";
};
export type Role = (typeof Role)[keyof typeof Role];
//# sourceMappingURL=enums.d.ts.map