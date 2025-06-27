import { useAppSelector } from "../../app/hooks";
import EndGame from "../../components/endgame/EndGame";
import InGame from "./InGame";
import Lobby from "./Lobby";
import PreGame from "./PreGame";

export default function Game() {
  const status = useAppSelector((state) => state.room!.status);

  switch (status) {
    case "lobby": {
      return <Lobby />;
    }
    case "in-game": {
      return <InGame />;
    }
    case "pre-game": {
      return <PreGame />;
    }
    case "ended": {
      return <EndGame />;
    }
    default: {
      return <>No Status</>;
    }
  }
}
