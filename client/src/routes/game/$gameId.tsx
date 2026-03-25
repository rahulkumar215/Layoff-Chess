import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Chess, Move, type Square } from "chess.js";
import {
  GAME_ADDED,
  GAME_ENDED,
  GAME_JOINED,
  GAME_OVER,
  INIT_GAME,
  JOIN_ROOM,
  MOVE,
  USER_TIMEOUT,
  type Metadata,
} from "@/consts/consts";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";
import { toast } from "sonner";
import { User } from "lucide-react";
import { cx } from "class-variance-authority";
import { useUserStore } from "@/store/auth-store";

export const Route = createFileRoute("/game/$gameId")({
  component: RouteComponent,
});

function RouteComponent() {
  const socket = useSocket();
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [gameID, setGameID] = useState("");
  const [gameAdded, setGameAdded] = useState(false);
  const [started, setStarted] = useState(false);
  const [myPlayerColor, setMyPlayerColor] = useState<"w" | "b">("w");
  const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
  const user = useUserStore((state) => state.user);

  // set the chessboard options
  const chessboardOptions = {
    boardStyle: {
      height: "500px",
      width: "500px",
      borderRadius: "5px",
    },
    position: chessPosition,
    squareStyles: optionSquares,
    onSquareClick,
    boardOrientation: myPlayerColor === "w" ? "white" : "black",
    onPieceDrop,
    allowDrawingArrows: true,
    id: "play-vs-random",
  };

  function isPromoting(chess: Chess, from: Square, to: Square) {
    if (!from) {
      return false;
    }

    const piece = chess.get(from);

    if (piece?.type !== "p") {
      return false;
    }

    if (piece.color !== chess.turn()) {
      return false;
    }

    if (!["1", "8"].some((it) => to.endsWith(it))) {
      return false;
    }

    return chess
      .history({ verbose: true })
      .map((it) => it.to)
      .includes(to);
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // try to make the move according to chess.js logic
    try {
      // update the position state upon successful move to trigger a re-render of the chessboard
      // ws.send(
      //   JSON.stringify({
      //     type: "move",
      //     position: chessGame.fen(),
      //   }),
      // );

      try {
        let moveResult: Move;

        if (
          isPromoting(chessGame, sourceSquare as Square, targetSquare as Square)
        ) {
          moveResult = chessGame.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
          });
        } else {
          moveResult = chessGame.move({
            from: sourceSquare,
            to: targetSquare,
          });
        }

        setChessPosition(chessGame.fen());

        if (moveResult) {
          socket.send(
            JSON.stringify({
              type: MOVE,
              payload: {
                gameId,
                move: moveResult,
              },
            }),
          );
        }
      } catch (e) {
        console.log("e", e);
      }
      // make random cpu move after a short delay

      // return true as the move was successful
      return true;
    } catch {
      // return false as the move was not successful
      return false;
    }
  }

  function getMoveOptions(square: Square) {
    console.log(square);
    const moves = chessGame.moves({
      square,
      verbose: true,
    });

    console.log(moves);

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    // loop through the moves and set the option squares
    for (const move of moves) {
      newSquares[move.to] = {
        background:
          chessGame.get(move.to) &&
          chessGame.get(move.to)?.color !== chessGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)" // larger circle for capturing
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        // smaller circle for moving
        borderRadius: "50%",
      };
    }
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    console.log(newSquares);
    setOptionSquares(newSquares);

    return true;
  }

  function onSquareClick({ square, piece }: SquareHandlerArgs) {
    console.log("Sqaure and Piece ", square, piece);
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square);

      if (hasMoveOptions) {
        setMoveFrom(square);
      }

      return;
    }

    const moves = chessGame.moves({
      square: moveFrom as Square,
      verbose: true,
    });

    console.log("Pre Moves ", moves);
    console.log(moveFrom, square);

    // finding played moves from playble moves by comparing previously clicked square and current clicked square
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    console.log("Moves ", moves);
    console.log("Found Move ", foundMove);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as Square);

      setMoveFrom(hasMoveOptions ? square : "");

      return;
    }

    try {
      chessGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
    } catch {
      const hasMoveOptions = getMoveOptions(square as Square);

      if (hasMoveOptions) {
        setMoveFrom(square);
      }

      return;
    }

    setChessPosition(chessGame.fen());

    setMoveFrom("");
    setOptionSquares({});
  }

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = function (e) {
      const message = JSON.parse(e.data);

      switch (message.type) {
        case GAME_ADDED:
          setGameAdded(true);
          setGameID(message.gameId);
          break;
        case INIT_GAME:
          chessGameRef.current = new Chess();
          setStarted(true);
          navigate({
            to: "/game/$gameId",
            params: { gameId: String(message.payload.gameId) || "" },
          });
          setGameMetadata({
            blackPlayer: message.payload.blackPlayer,
            whitePlayer: message.payload.whitePlayer,
          });
          setMyPlayerColor(
            message.payload.whitePlayer.id === user?.id ? "w" : "b",
          );
          break;
        case MOVE: {
          const { move } = message.payload;
          try {
            if (isPromoting(chessGame, move.from, move.to)) {
              chessGame.move({
                from: move.from,
                to: move.to,
                promotion: "q",
              });
            } else {
              chessGame.move({ from: move.from, to: move.to });
            }
            setChessPosition(chessGame.fen());
          } catch (err) {
            console.error(err);
          }
          break;
        }
        case GAME_OVER:
          toast.message(message.payload.status);
          break;
        case GAME_ENDED: {
          let wonBy;
          switch (message.payload.status) {
            case "COMPLETED":
              wonBy = message.payload.result !== "DRAW" ? "CheckMate" : "Draw";
              break;
            case "PLAYER_EXIT":
              wonBy = "Player Exit";
              break;
            default:
              wonBy = "Timeout";
          }
          toast.message(wonBy);
          chessGame.reset();
          setStarted(false);
          setGameAdded(false);
          break;
        }
        case USER_TIMEOUT:
          toast.message(message.payload.win);
          break;

        case GAME_JOINED:
          setGameMetadata({
            blackPlayer: message.payload.blackPlayer,
            whitePlayer: message.payload.whitePlayer,
          });
          setMyPlayerColor(
            message.payload.whitePlayer.id === user?.id ? "w" : "b",
          );
          console.error(message.payload);
          setStarted(true);

          message.payload.moves.map((x: Move) => {
            if (isPromoting(chessGame, x.from, x.to)) {
              chessGame.move({ ...x, promotion: "q" });
            } else {
              chessGame.move(x);
            }
          });
          setChessPosition(chessGame.fen());

          break;
        default:
          toast.error(message.payload.message);
          break;
      }
    };

    if (gameId !== "random") {
      socket.send(
        JSON.stringify({
          type: JOIN_ROOM,
          payload: {
            gameId,
          },
        }),
      );
    }
  }, [chessGame, navigate, socket, gameId]);

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4 p-4 ">
      <Chessboard options={chessboardOptions} />

      <div className="flex flex-col gap-4">
        {gameId === "random" && !started && (
          <Button
            type="button"
            onClick={() => {
              socket?.send(
                JSON.stringify({
                  type: INIT_GAME,
                }),
              );
            }}
          >
            Play As Guest
          </Button>
        )}

        {started && gameMetadata && (
          <div className="flex  gap-2 items-center justify-center border-2 border-gray-600 bg-blue-600 p-4 rounded-md">
            <div
              className={cx(
                "flex items-center justify-center gap-2 bg-white text-black p-2 rounded-md transition-all duration-300 ease-in border-3 border-black",
                myPlayerColor === "w" &&
                  chessGame.turn() === "w" &&
                  "border-lime-600",
              )}
            >
              <User />
              {gameMetadata?.whitePlayer.name}
            </div>
            V/S
            <div
              className={cx(
                "flex items-center justify-center gap-2 bg-black text-white p-2 rounded-md transition-all duration-300 ease-in border-3 border-black",
                myPlayerColor === "b" &&
                  chessGame.turn() === "b" &&
                  "border-lime-600",
              )}
            >
              <User />
              {gameMetadata?.blackPlayer.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
