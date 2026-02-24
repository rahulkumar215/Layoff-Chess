import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import { FaChessKnight } from "react-icons/fa6";
import { SiChessdotcom } from "react-icons/si";
import { IoExtensionPuzzle } from "react-icons/io5";
import { IoIosAnalytics } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { cx } from "class-variance-authority";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";
import { useRef, useState } from "react";
import { Chess, type Square } from "chess.js";

export function App() {
  const ws = new WebSocket("ws://localhost:5000");
  ws.onopen = () => {
    console.log("user connected");
  };

  // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  ws.onmessage = (message) => {
    const parsedMessage = JSON.parse(message.data);
    console.log(parsedMessage);

    if (parsedMessage.type === "move") {
      // setChessPosition(parsedMessage.position);
    }
  };

  // make a random "CPU" move
  function makeRandomMove() {
    // get all possible moves`
    const possibleMoves = chessGame.moves();

    // exit if the game is over
    if (chessGame.isGameOver()) {
      return;
    }

    // pick a random move
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // make the move
    chessGame.move(randomMove);

    // update the position state
    setChessPosition(chessGame.fen());
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // try to make the move according to chess.js logic
    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      // update the position state upon successful move to trigger a re-render of the chessboard
      setChessPosition(chessGame.fen());
      // ws.send(
      //   JSON.stringify({
      //     type: "move",
      //     position: chessGame.fen(),
      //   }),
      // );

      // make random cpu move after a short delay
      setTimeout(makeRandomMove, 500);

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

    setTimeout(makeRandomMove, 300);

    setMoveFrom("");
    setOptionSquares({});
  }

  // set the chessboard options
  const chessboardOptions = {
    boardStyle: {
      height: "500px",
      width: "500px",
    },
    position: chessPosition,
    squareStyles: optionSquares,
    onSquareClick,
    onPieceDrop,
    allowDrawingArrows: true,
    id: "play-vs-random",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden"
                >
                  <a href="#">
                    <FaChessKnight className="text-foreground" />
                    <span>Layoff Chess</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-1.5">
                <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                  <SiChessdotcom />
                  <span>Play Chess</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="p-1.5">
                <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                  <IoExtensionPuzzle />
                  <span>Solve Puzzels</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenuItem className="p-1.5">
              <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                <IoIosAnalytics />
                <span>Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="p-1.5">
              <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                <FaUserFriends />
                <span>Friends</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col w-full">
          <header className="flex h-10 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground" />

              <Separator orientation="vertical" className="h-4 self-center!" />
            </div>

            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Play Chess
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Solve Puzzels
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Analysis
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Friends
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenu>

            <Button>New</Button>
          </header>

          <main className="flex-1 p-6">
            <Chessboard options={chessboardOptions} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;
