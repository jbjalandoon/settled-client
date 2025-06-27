import { useAppSelector } from "../../app/hooks";
import { Games } from "../../features/room/roomSlice";
import { getSessionID } from "../../helper/cookies";

export default function Result({ prevGame }: { prevGame: Games }) {
  const id = getSessionID();
  const { winner } = useAppSelector((state) => state[prevGame]!.details);
  const stats = useAppSelector((state) => state[prevGame]!.stats);
  let text: string = "";
  switch (prevGame) {
    case "typing": {
      text =
        winner === id
          ? `Your fingers are on fire—no one can keep up!`
          : `I’ve seen snails finish marathons quicker than you finish sentences.`;
      break;
    }
    case "memory": {
      const gameEnded = stats!.timeFinished;
      if (gameEnded) {
        text =
          winner === id
            ? `Your recall is legendary—keep it up!`
            : `You remember less than a browser in incognito mode.`;
      } else {
        text =
          winner === id
            ? `You won by doing virtually nothing; that’s next-level strategic underachievement.`
            : `You remember less than a browser in incognito mode.`;
      }
      break;
    }
    case "connect": {
      text =
        winner === id
          ? `Well played—your piece placement was exactly what the board needed.`
          : `You played Connect 4 like it was Connect 0.`;
      break;
    }
  }
  return <span className="text-xl text-white">{text}</span>;
}
