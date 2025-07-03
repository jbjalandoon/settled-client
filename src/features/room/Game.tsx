import { useAppSelector } from "../../app/hooks";
import EndGame from "../../components/endgame/EndGame";
import { getSessionID } from "../../helper/cookies";
import InGame from "./InGame";
import Lobby from "./Lobby";
import PreGame from "./PreGame";

export default function Game() {
  const status = useAppSelector((state) => state.room!.status);
  const players = useAppSelector((state) => state.room!.players);
  const id = getSessionID();

  if (status !== "lobby" && !Object.keys(players).includes(id)) {
    return (
      <p className="text-3xl">
        Game has started. Currently working on watching a live game :)
      </p>
    );
  }

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
