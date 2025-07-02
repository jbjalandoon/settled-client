import { MouseEventHandler, useEffect, useState } from "react";
import { joinRoom, startRoom } from "../../api/room";
import { useParams } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSessionID } from "../../helper/cookies";
import {
  GameDetails,
  Games,
  Player,
  PlayerDetail,
  playerJoined,
  playerLeave,
  roomStarted,
  RoomStatus,
} from "../../features/room/roomSlice";
import { initializedMemory } from "../../features/memory/memorySlice";
import { useSocket } from "../../hooks/useSocket";
import { initializedTyping } from "../../features/typing/typingSlice";
import { initializedConnect } from "../../features/connect/connectSlice";
import { FaCopy, FaPlay, FaDoorOpen } from "react-icons/fa";
import { toast } from "react-toastify";

export default function LobbyButton() {
  const { room } = useParams({ from: "/$room" });
  const { socket } = useSocket();
  const id = getSessionID();
  const dispatch = useAppDispatch();
  const isJoined = useAppSelector((state) => state.room!.joined);
  const host = useAppSelector((state) => state.room!.host);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handlePlayerJoined(playerDetail: PlayerDetail, id: string) {
      dispatch(playerJoined({ playerDetail, id }));
    }

    function handlePlayerLeave(leaver: string) {
      dispatch(playerLeave({ id: leaver, joined: leaver !== id }));
    }

    function handleGameStart(
      gameDetails: GameDetails,
      players: Player,
      status: RoomStatus,
      phase: number,
      games: Games[],
    ) {
      dispatch(
        roomStarted({
          gameDetails,
          players,
          status,
          phase,
        }),
      );
      for (const game of games) {
        switch (game as Games) {
          case "memory": {
            dispatch(
              initializedMemory({
                players: players,
                gameDetails: gameDetails.memory,
              }),
            );
            break;
          }
          case "typing": {
            dispatch(
              initializedTyping({
                players: players,
                gameDetails: gameDetails.typing,
              }),
            );
            break;
          }
          case "connect": {
            dispatch(
              initializedConnect({
                gameDetails: gameDetails.connect,
              }),
            );
            break;
          }
        }
      }
    }

    function handleRoomStarting() {
      setIsSubmitting(true);
    }

    socket.on("room-start", handleGameStart);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-leave", handlePlayerLeave);
    socket.on("room-starting", handleRoomStarting);

    return () => {
      socket.off("room-start", handleGameStart);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-leave", handlePlayerLeave);
      socket.off("room-starting", handleRoomStarting);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoin: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      const { status } = await joinRoom(room);

      if (status !== 201) {
        return console.log("Something went wrong, you can't join the game.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        switch (error.response!.status) {
          case 400: {
            alert("Lobby is full");
            break;
          }
          default: {
            alert("Something went wrong in the server");
          }
        }
      } else {
        alert("something went wrong");
      }
    }
  };

  const handleStart: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      setIsSubmitting(true);
      await startRoom(room);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-auto items-center justify-center gap-5 py-5">
      {host === id && (
        <>
          <button
            className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-blue-900 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast.info("Invite link has been copied to clipboard", {
                  position: "top-center",
                  theme: "dark",
                  autoClose: 2000,
                  pauseOnHover: false,
                  hideProgressBar: true,
                  closeButton: false,
                  toastId: "clipboard",
                  style: {
                    fontSize: "16px",
                  },
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                toast.error(
                  "Can't copy the code, copy it manually in the url",
                  {
                    position: "top-center",
                    theme: "dark",
                    autoClose: 2000,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    toastId: "clipboard",
                    style: {
                      fontSize: "16px",
                    },
                  },
                );
              }
            }}
          >
            <FaCopy />
            Invite
          </button>
          <button
            className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-blue-900 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            onClick={handleStart}
          >
            <FaPlay />
            Start
          </button>
        </>
      )}
      {host !== id && isJoined && (
        <div className="font-dyna animate-bounce text-xl text-white uppercase">
          Waiting for host to start the game
        </div>
      )}
      {host !== id && !isJoined && (
        <button
          className="py3 flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-blue-900 disabled:cursor-not-allowed"
          onClick={handleJoin}
        >
          <FaDoorOpen />
          Join
        </button>
      )}
    </div>
  );
}
