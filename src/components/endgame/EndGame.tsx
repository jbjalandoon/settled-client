import { useParams } from "@tanstack/react-router";
import { resetRoom } from "../../api/room";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";
import { Room } from "../../features/room/roomSlice";
import { resetRoom as roomReset } from "../../features/room/roomSlice";
import { typingReset } from "../../features/typing/typingSlice";
import { memoryReset } from "../../features/memory/memorySlice";
import { FaPlay } from "react-icons/fa";
import Logo from "../global/Logo";
import Score from "../global/Score";

export default function EndGame() {
  const { socket } = useSocket();
  const { room } = useParams({ from: "/$room" });
  const dispatch = useAppDispatch();
  const { winner, players } = useAppSelector((state) => state.room!);
  const loser = Object.keys(players).filter((el) => el !== winner)[0];

  useEffect(() => {
    function handleResetRoom(roomDetail: Room) {
      dispatch(roomReset({ ...roomDetail, joined: true }));
      dispatch(typingReset());
      dispatch(memoryReset());
    }
    socket.on("reset-room", handleResetRoom);

    return () => {
      socket.off("reset-room", handleResetRoom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePlayAgain() {
    try {
      await resetRoom(room);
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  }

  return (
    <div className="font-atkinson flex w-full flex-col items-center justify-center gap-5 text-center text-white">
      <Logo svgClassName="w-74" />
      <Score showReady={false} showScore={true} />
      <p className="text-center text-2xl">
        The score was{" "}
        <span className="text-3xl font-bold">
          {players[winner!].score}-{players[loser!].score}
        </span>{" "}
        in favor of{" "}
        <span className="text-3xl font-bold">{players[winner!].name}</span>.
      </p>
      <p className="rounded-xl bg-slate-800 px-3 py-2">
        It's settled,{" "}
        <span className="text-2xl font-bold">{players[winner!].name}</span> was
        just better, case closed.
      </p>
      <button
        className="font-inter flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-3 py-4 text-lg font-bold text-white shadow-lg shadow-black hover:bg-blue-900 disabled:cursor-not-allowed"
        onClick={handlePlayAgain}
      >
        <FaPlay />
        Play Again
      </button>
    </div>
  );
}
