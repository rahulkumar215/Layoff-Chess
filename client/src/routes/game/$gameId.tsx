import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Chess, Move, type PieceSymbol, type Square } from "chess.js";
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
  chessColumnToColumnIndex,
  defaultPieces,
  type PieceDropHandlerArgs,
  type PieceRenderObject,
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
  const [promotionMove, setPromotionMove] = useState<Omit<
    PieceDropHandlerArgs,
    "piece"
  > | null>(null);
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
      .moves({ square: from, verbose: true })
      .map((it) => it.to)
      .includes(to);
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    try {
      let moveResult: Move;

      if (
        isPromoting(chessGame, sourceSquare as Square, targetSquare as Square)
      ) {
        setPromotionMove({
          sourceSquare,
          targetSquare,
        });
        return;
      } else {
        moveResult = chessGame.move({
          from: sourceSquare,
          to: targetSquare,
        });
      }
      setChessPosition((prev) => chessGame.fen());

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

      return true;
    } catch (e) {
      console.error("e", e);
      return false;
    }
  }

  // handle promotion piece select
  function onPromotionPieceSelect(piece: PieceSymbol) {
    try {
      const moveResult = chessGame.move({
        from: promotionMove!.sourceSquare,
        to: promotionMove!.targetSquare as Square,
        promotion: piece,
      });
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
    } catch (err) {
      // do nothing
      console.error(err);
    }

    // reset the promotion move to clear the promotion dialog
    setPromotionMove(null);
  }

  function getMoveOptions(square: Square) {
    const moves = chessGame.moves({
      square,
      verbose: true,
    });

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
    setOptionSquares(newSquares);

    return true;
  }

  function onSquareClick({ square, piece }: SquareHandlerArgs) {
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

    // finding played moves from playble moves by comparing previously clicked square and current clicked square
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as Square);

      setMoveFrom(hasMoveOptions ? square : "");

      return;
    }

    try {
      let moveResult: Move;

      if (isPromoting(chessGame, moveFrom as Square, square as Square)) {
        setPromotionMove({
          targetSquare: moveFrom,
          sourceSquare: square,
        });
        return;
      } else {
        moveResult = chessGame.move({
          from: moveFrom,
          to: square,
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
      console.error("e", e);
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }
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
                promotion: move.promotion || "q",
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
          setStarted(true);

          message.payload.moves.map((x: Move) => {
            if (isPromoting(chessGame, x.from, x.to)) {
              chessGame.move({ ...x, promotion: x.promotion || "q" });
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

  // calculate the left position of the promotion square
  const squareWidth =
    document
      .querySelector(`[data-column="a"][data-row="1"]`)
      ?.getBoundingClientRect()?.width ?? 0;
  const promotionSquareLeft = promotionMove?.targetSquare
    ? squareWidth *
      chessColumnToColumnIndex(
        promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? "",
        8,
        // number of columns
        myPlayerColor === "w" ? "white" : "black", // board orientation
      )
    : 0;

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4 p-4 ">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          {promotionMove ? (
            <div
              onClick={() => setPromotionMove(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setPromotionMove(null);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
              }}
            />
          ) : null}

          {promotionMove ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: promotionSquareLeft,
                backgroundColor: "white",
                width: squareWidth,
                zIndex: 1001,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
              }}
            >
              {(["q", "r", "n", "b"] as PieceSymbol[]).map((piece) => (
                <button
                  key={piece}
                  onClick={() => {
                    onPromotionPieceSelect(piece);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {defaultPieces[
                    `${myPlayerColor}${piece.toUpperCase()}` as keyof PieceRenderObject
                  ]()}
                </button>
              ))}
            </div>
          ) : null}

          <Chessboard options={chessboardOptions} />
        </div>
      </div>

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
