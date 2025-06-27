import { useEffect, useRef, useState } from "react";
import Tile from "./Tile";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSessionID } from "../../helper/cookies";
import { memoryWinner, nextLevel } from "../../features/memory/memorySlice";
import { playerWon } from "../../features/room/roomSlice";
import { useSocket } from "../../hooks/useSocket";
import Winner from "../global/Winner";

const TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function Chimp() {
  const { socket } = useSocket();

  const tiles = useRef(null);

  const id = getSessionID();
  const dispatch = useAppDispatch();
  const { sequence, startTime, winner } = useAppSelector(
    (state) => state.memory!.details,
  );
  const { level } = useAppSelector((state) => state.memory!.stats[id]);
  const { players } = useAppSelector((state) => state.room!);
  const [active, setActive] = useState(-1);
  const clickedTiles = useRef(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [loser, setLoser] = useState<string | null>(null);

  useEffect(() => {
    function handleNextLevel(id: string) {
      dispatch(nextLevel(id));
    }

    function handleGameOver(
      winner: string | null,
      timeFinished: number | null,
      id?: string,
    ) {
      setGameActive(false);
      dispatch(memoryWinner({ winner, timeFinished }));
      dispatch(playerWon(winner));
      if (id) {
        setLoser(id);
      }
    }

    setTimeRemaining(startTime! + 300000 - Date.now());
    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1000);
    }, 1000);

    socket.on("memory-next-level", handleNextLevel);
    socket.on("memory-game-over", handleGameOver);

    return () => {
      socket.off("memory-next-level", handleNextLevel);
      socket.off("memory-game-over", handleGameOver);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const playSequence = async () => {
      setGameActive(false);
      for (const number of sequence.slice(0, level)) {
        setActive(number);
        await new Promise((res) => setTimeout(res, 600));
        setActive(-1);
        await new Promise((res) => setTimeout(res, 50));
      }
      setGameActive(true);
    };

    playSequence();
  }, [level, sequence]);

  const handleTileClick = async (tileNumber: number) => {
    if (!gameActive) return;

    if (tileNumber === sequence[clickedTiles.current]) {
      clickedTiles.current += 1;
      socket.emit("memory-correct-tile");
      if (clickedTiles.current === sequence.slice(0, level).length) {
        setGameActive(false);
        if (sequence.length === level) {
          socket.emit("memory-finished", id);
        } else {
          setTimeout(() => {
            clickedTiles.current = 0;
            socket.emit("memory-next-level", level + 1);
          }, 1000);
        }
      }
    } else {
      socket.emit("memory-game-over");
      setGameActive(false);
    }
  };
  return (
    <>
      <div className="font-atkinson flex h-full w-full flex-col items-center justify-center gap-3 text-white">
        <div className="flex justify-center gap-15 text-xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex gap-3">
              <span>Level: {level} / 15</span>
              <span>|</span>
              <span>
                {Math.floor(timeRemaining / 1000 / 60)
                  .toFixed(0)
                  .padStart(2, "0")}
                :
                {Math.floor((timeRemaining / 1000) % 60)
                  .toFixed(0)
                  .padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        {winner &&
          (loser ? (
            <Winner
              message={
                winner === id
                  ? `${players[loser].name} just made a mistake`
                  : `You just made a mistake`
              }
              winner={winner}
            />
          ) : (
            <Winner
              message={
                winner === id
                  ? `You cleared 15 levels`
                  : `${players[winner].name} cleared 15 levels faster than you.`
              }
              winner={winner}
            />
          ))}
        <div
          className="grid w-full max-w-120 grid-cols-3 grid-rows-3 gap-5"
          ref={tiles}
          style={{}}
        >
          {TILES.map((e) => (
            <Tile
              gameActive={gameActive}
              key={e}
              active={e === active}
              onClick={() => {
                handleTileClick(e);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
