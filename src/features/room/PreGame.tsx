import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSessionID } from "../../helper/cookies";
import { Games, nextGameStarted, playerReady } from "./roomSlice";
import { useSocket } from "../../hooks/useSocket";
import Logo from "../../components/global/Logo";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Score from "../../components/global/Score";
import { startMemoryGame } from "../memory/memorySlice";
import { startTypingGame } from "../typing/typingSlice";

export type GameDescription = {
  [keys in Games]: {
    title: string;
    description: string;
  };
};

const GAME_DESCRIPTION: GameDescription = {
  typing: {
    title: "Typing Race",
    description:
      "Type a given text passage as quickly and accurately as possible. First one to finish is the winner.",
  },
  memory: {
    title: "Memory Sequence",
    description:
      "Remember and click the square in exactly the order they appeared. Every level has 1 minute timer. One mistake will cost you the game. First one to finish 15 levels win. ",
  },
  connect: {
    title: "Connect Four",
    description:
      "The goal is to connect four in a row (horizontally, vertically, or diagonally), if all slots are filled without four in a row, the game will reset until there is a winner.",
  },
  tieBreaker: {
    title: "Tie Breaker",
    description:
      "To settle the score, you will compete in the classic best of 3 rock-paper-scissor",
  },
};

export default function PreGame() {
  const players = useAppSelector((state) => state.room!.players);
  const { socket } = useSocket();
  const game = useAppSelector((state) => state.room!.games[state.room!.phase]);
  const id = getSessionID();
  const dispatch = useAppDispatch();

  const [countingDown, setCountingDown] = useState(false);
  const [seconds, setSeconds] = useState<null | number>(null);
  const playerKeys = Object.keys(players);

  playerKeys.sort((a, b) => {
    if (a === id || b === "") {
      return -1;
    } else {
      return 1;
    }
  });

  useEffect(() => {
    const handleCountdown = (start: number) => {
      setCountingDown(true);
      setSeconds(Math.ceil((start - Date.now()) / 1000));
      const interval = setInterval(() => {
        setSeconds(Math.ceil((start - Date.now()) / 1000));
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, start - Date.now());
    };

    const handleGameStart = (start: number, game: Games) => {
      dispatch(nextGameStarted());
      switch (game) {
        case "memory": {
          dispatch(startMemoryGame(start));
          break;
        }
        case "typing": {
          dispatch(startTypingGame(start));
          break;
        }
      }
    };

    socket.on("countdown", handleCountdown);
    socket.on("game-start", handleGameStart);

    return () => {
      socket.off("countdown", handleCountdown);
      socket.off("game-start", handleGameStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePlayerReady = (id: string, ready: boolean) => {
      dispatch(playerReady({ id, ready }));
    };

    const handlePlayerReadyError = () => {
      alert("Something went wrong");
    };
    socket.on("player-ready", handlePlayerReady);
    socket.on("player-ready-error", handlePlayerReadyError);
    return () => {
      socket.off("player-ready", handlePlayerReady);
      socket.off("player-ready-error", handlePlayerReadyError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReady = () => {
    socket.emit("player-ready");
  };

  return (
    <div className="font-inter relative flex flex-col items-center justify-center gap-7 text-white">
      <Logo
        className={"font-lucky h-fit w-fit text-center text-2xl sm:text-3xl"}
        svgClassName="h-25 w-50"
      >
        {GAME_DESCRIPTION[game].title}
      </Logo>
      <div className="mt-4 flex flex-col items-center gap-2 px-2 text-center sm:max-w-3/4 md:max-w-1/2">
        <p className="w-full text-center text-base text-slate-300 sm:text-lg">
          {GAME_DESCRIPTION[game].description}
        </p>
      </div>
      <Score showReady={true} showScore={true} />
      <button
        className={`flex cursor-pointer items-center justify-evenly gap-3 rounded-xl bg-blue-800 px-4 py-3 text-2xl font-bold text-white shadow-lg shadow-black disabled:cursor-not-allowed ${players[id].ready ? "bg-red-700 hover:bg-red-900" : "bg-green-700 hover:bg-green-900"}`}
        onClick={handleReady}
        disabled={countingDown}
      >
        {!countingDown && (
          <>
            <span className="self-center">
              {!players[id].ready ? <FaCheck /> : <FaXmark />}
            </span>
            {!players[id].ready ? "Ready" : "Unready"}
          </>
        )}
        {countingDown && `Starting in ${seconds}`}
      </button>
    </div>
  );
}
