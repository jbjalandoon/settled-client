import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { useAppDispatch } from "../../app/hooks";
import type { Room } from "./roomSlice";
import {
  gameEnded,
  gameTieBreaker,
  initializedRoom,
  nextPhaseUpdated,
} from "./roomSlice";
import Game from "./Game";
import { initializedMemory } from "../memory/memorySlice";
import { useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { initializedTyping } from "../typing/typingSlice";
import { initializedConnect } from "../connect/connectSlice";
import {
  addTieBreaker,
  initializedTieBreaker,
  TieBreakerGameDetails,
  TieBreakerGameStats,
} from "../tie-breaker/tieBreakerSlice";

export default function Room() {
  const loader = useLoaderData({ from: "/$room" });
  const { room } = useParams({ from: "/$room" });
  const { socket, resetSocket } = useSocket();
  const navigate = useNavigate({ from: "/$room" });
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit("join-room", room);
    resetSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    function handleNextPhase(phase: number) {
      dispatch(nextPhaseUpdated(phase));
    }

    function handleGameEnded(winner: string) {
      dispatch(gameEnded(winner));
    }

    function handleTieBreaker(
      details: TieBreakerGameDetails,
      stats: { [key in string]: TieBreakerGameStats },
    ) {
      dispatch(gameTieBreaker());
      dispatch(
        addTieBreaker({
          details,
          stats,
        }),
      );
    }

    socket.on("next-phase", handleNextPhase);
    socket.on("game-ended", handleGameEnded);
    socket.on("tie-breaker", handleTieBreaker);

    return () => {
      socket.off("next-phase", handleNextPhase);
      socket.off("game-ended", handleGameEnded);
      socket.off("tie-breaker", handleTieBreaker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loader === null) {
    return (
      <div className="flex flex-col gap-3 text-center text-3xl">
        <p className="">Room not found.</p>
        <a
          className="cursor-pointer underline"
          onClick={() => navigate({ to: "/", from: "/$room" })}
        >
          Go Back
        </a>
      </div>
    );
  }

  const gameDetails = loader.gameDetails;
  const players = loader.players;

  if (gameDetails) {
    for (const key of Object.keys(gameDetails)) {
      switch (key) {
        case "memory": {
          dispatch(
            initializedMemory({
              players: players,
              gameDetails: gameDetails!.memory,
            }),
          );
          break;
        }
        case "typing": {
          dispatch(
            initializedTyping({
              players: players,
              gameDetails: gameDetails!.typing,
            }),
          );
          break;
        }
        case "connect": {
          dispatch(initializedConnect({ gameDetails: gameDetails!.connect }));
          break;
        }
        case "tieBreaker": {
          dispatch(
            initializedTieBreaker({
              players: players,
              gameDetails: gameDetails!.tieBreaker,
            }),
          );
          break;
        }
      }
    }
  }

  delete loader.gameDetails;
  for (const key of Object.keys(loader.players)) {
    delete loader.players[key].gameStats;
  }
  dispatch(initializedRoom(loader));

  return <Game />;
}
