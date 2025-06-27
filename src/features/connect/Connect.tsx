import ConnectBoard from "../../components/connect/ConnectBoard";
import { useAppSelector } from "../../app/hooks";
import Winner from "../../components/global/Winner";
import Score from "../../components/global/Score";

export default function Connect() {
  const winner = useAppSelector((state) => state!.connect!.details.winner);
  const players = useAppSelector((state) => state.room!.players);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-7 py-24 text-white">
      {winner && (
        <Winner
          message={`${players[winner].name} made 4 in a row`}
          winner={winner}
        />
      )}
      <Score showReady={false} showScore />
      <ConnectBoard />
    </div>
  );
}
