import { useAppSelector } from "../../app/hooks";
import Memory from "../../components/memory/Memory";
import Connect from "../connect/Connect";
import { TieBreaker } from "../tie-breaker/TieBreaker";
import Typing from "../typing/Typing";

export default function InGame() {
  const game = useAppSelector((state) => state.room!.games[state.room!.phase]);
  switch (game) {
    case "typing": {
      return <Typing />;
    }
    case "memory": {
      return <Memory />;
    }
    case "connect": {
      return <Connect />;
    }
    case "tieBreaker": {
      return <TieBreaker />;
    }
    default: {
      return <div>No Game</div>;
    }
  }
}
