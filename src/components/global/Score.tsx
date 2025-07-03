import { useAppSelector } from "../../app/hooks";
import { getSessionID } from "../../helper/cookies";
import vs from "../../assets/img/vs.png";
import Avatar from "../lobby/Avatar";

export default function Score({
  showReady,
  showScore,
}: {
  showReady: boolean;
  showScore?: boolean;
}) {
  const id = getSessionID();
  const players = useAppSelector((state) => state.room!.players);
  const playerKeys = Object.keys(players);

  return (
    <div className="xs:gap-8 relative flex w-auto items-center justify-evenly gap-1 text-xl sm:gap-12">
      <div
        className="relative flex w-auto flex-col items-center justify-center"
        key={id}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full p-2">
            <Avatar
              flip={true}
              player={id}
              className={
                "relative h-17 w-17 outline-5 outline-blue-900 sm:h-24 sm:w-24"
              }
              changeable={false}
              readyIcon={showReady}
              ready={players[id].ready}
            />
          </div>
          <h1 className="font-inter relative max-w-[18ch] min-w-[9ch] text-center text-lg font-bold whitespace-nowrap text-white">
            {players[id].name}
          </h1>
        </div>
        {showScore && (
          <h1 className="font-dyna flex justify-evenly text-3xl">
            {players[id].score}
          </h1>
        )}
      </div>
      <img src={vs} className="h-7 w-7" alt="VS" />
      {playerKeys
        .filter((el) => el !== id)
        .map((key) => (
          <div
            className="relative flex w-auto flex-col items-center justify-center"
            key={key}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full p-2">
                <Avatar
                  flip={false}
                  player={key}
                  className={
                    "relative h-17 w-17 outline-5 outline-red-900 sm:h-24 sm:w-24"
                  }
                  changeable={false}
                  readyIcon={showReady}
                  ready={players[key].ready}
                />
              </div>
              <h1 className="font-inter relative max-w-[18ch] min-w-[9ch] text-center text-lg font-bold whitespace-nowrap text-white">
                {players[key].name}
              </h1>
            </div>
            {showScore && (
              <h1 className="font-dyna flex justify-evenly text-3xl">
                {players[key].score}
              </h1>
            )}
          </div>
        ))}
      {/* TODO: Create an image for this VS */}
    </div>
  );
}
