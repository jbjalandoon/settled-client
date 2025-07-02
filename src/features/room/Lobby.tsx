import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "@tanstack/react-router";
import { getSessionID } from "../../helper/cookies";
import Avatar from "../../components/lobby/Avatar";
import LobbyButton from "../../components/lobby/LobbyButton";
import vs from "../../assets/img/vs.png";
import GameLists from "../../components/gamelist/GameLists";
import ChangeName from "../../components/lobby/ChangeName";
export default function Lobby() {
  const navigate = useNavigate({ from: "/$room" });
  const players = useAppSelector((state) => state.room!.players);
  const host = useAppSelector((state) => state.room!.host);
  const playerKeys = Object.keys(players);
  const id = getSessionID();
  const isJoined = useAppSelector((state) => state.room!.joined);
  if (playerKeys.length === 0) {
    navigate({ to: "/" });
  }

  if (playerKeys.length === 1) playerKeys.push("");

  playerKeys.sort((a, b) => {
    if (a === id || b === "") {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-1 py-3 sm:gap-10">
        <div className="xs:gap-8 relative flex h-31 min-h-31 w-full items-center justify-center gap-2 text-xl">
          <div
            className="relative flex flex-col items-center justify-center gap-2 text-center"
            key={players[id] ? id : host}
          >
            <div className="rounded-full p-2">
              <Avatar
                flip={true}
                player={players[id] ? id : host}
                className={
                  "xs:w-16 xs:h-16 relative h-12 w-12 outline-5 outline-blue-900 sm:h-24 sm:w-24"
                }
                changeable={true}
                readyIcon={false}
                ready={false}
              />
            </div>
            <h1 className="font-inter relative w-[9ch] text-center text-lg font-bold whitespace-nowrap text-white">
              {players[id] ? players[id].name : players[host].name}
            </h1>
          </div>
          <img src={vs} className="h-7" />
          {playerKeys
            .filter((el) => {
              if (el === id) {
                return false;
              } else {
                if (el === host && !players[id]) {
                  return false;
                }
                return true;
              }
            })
            .map((key) => (
              <div
                className="relative flex w-auto flex-col items-center justify-center gap-2"
                key={key}
              >
                <div className="rounded-full p-2">
                  <Avatar
                    flip={false}
                    player={key}
                    className={
                      "xs:w-16 xs:h-16 h-12 w-12 outline-5 outline-red-900 sm:h-24 sm:w-24"
                    }
                    changeable={id === key}
                    readyIcon={false}
                    ready={false}
                  />
                </div>
                <h1 className="font-inter relative min-w-[9ch] text-center text-lg font-bold whitespace-nowrap text-white">
                  {players[key] ? players[key].name : "Waiting..."}
                </h1>
              </div>
            ))}
          {/* TODO: Create an image for this VS */}
        </div>
        {isJoined && <ChangeName isJoined={isJoined} />}
        <GameLists clickable={host === id} />
        <LobbyButton />
      </div>
    </>
  );
}
