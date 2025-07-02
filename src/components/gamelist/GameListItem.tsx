import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Games, gameToggled } from "../../features/room/roomSlice";
import { useSocket } from "../../hooks/useSocket";

export default function GameListItem({
  title,
  display,
  description,
  isClickable,
}: {
  title: Games;
  display: string;
  description: string;
  isClickable: boolean;
}) {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const games = new Set<Games>(
    useAppSelector((state) => state.room!.games) as Games[],
  );

  const [hover, setHover] = useState(false);
  const isActive = games.has(title);
  useEffect(() => {
    function toggleGame(updatedGames: Games[]) {
      dispatch(gameToggled(updatedGames));
    }

    socket.on("toggle-game", toggleGame);

    return () => {
      socket.off("toggle-game", toggleGame);
    };
  }, [socket]);

  function handleSelectGame() {
    socket.emit("toggle-game", title);
  }
  return (
    <div
      className={`${isActive ? "outline-2 outline-cyan-600" : "outline-none"} font-inter relative flex min-h-18 flex-row items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-700 px-3 py-2 text-3xl text-white capitalize select-none sm:max-h-25 sm:min-h-32 sm:flex-col sm:gap-1 sm:px-0`}
      style={{
        cursor: isClickable ? "pointer" : "default",
      }}
      onClick={isClickable ? handleSelectGame : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`h-auto w-15 sm:mt-12 sm:h-20 sm:w-20 ${hover ? "sm:opacity-0" : "sm:opacity-100"} transition-opacity duration-150`}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-22.5 -22.5 326.23 326.23"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.0028123200000000005"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#CCCCCC"
            strokeWidth="11.811744000000001"
          >
            {" "}
            <g>
              {" "}
              <path d="M231.634,79.976v-0.751C231.634,30.181,192.772,0,137.32,0c-31.987,0-57.415,9.018-77.784,22.98 c-11.841,8.115-12.907,25.906-4.232,37.355l6.326,8.349c8.675,11.444,24.209,12.532,36.784,5.586 c11.46-6.331,23.083-9.758,34-9.758c18.107,0,28.294,7.919,28.294,20.75v0.375c0,16.225-15.469,39.411-59.231,43.181l-1.507,1.697 c-0.832,0.936,0.218,13.212,2.339,27.413l1.741,11.58c2.121,14.201,14.065,25.71,26.668,25.71s23.839-5.406,25.08-12.069 c1.256-6.668,2.268-12.075,2.268-12.075C199.935,160.882,231.634,127.513,231.634,79.976z"></path>{" "}
              <path d="M118.42,217.095c-14.359,0-25.993,11.64-25.993,25.999v12.14c0,14.359,11.64,25.999,25.993,25.999 h22.322c14.359,0,25.999-11.64,25.999-25.999v-12.14c0-14.359-11.645-25.999-25.999-25.999H118.42z"></path>{" "}
            </g>{" "}
          </g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <path d="M231.634,79.976v-0.751C231.634,30.181,192.772,0,137.32,0c-31.987,0-57.415,9.018-77.784,22.98 c-11.841,8.115-12.907,25.906-4.232,37.355l6.326,8.349c8.675,11.444,24.209,12.532,36.784,5.586 c11.46-6.331,23.083-9.758,34-9.758c18.107,0,28.294,7.919,28.294,20.75v0.375c0,16.225-15.469,39.411-59.231,43.181l-1.507,1.697 c-0.832,0.936,0.218,13.212,2.339,27.413l1.741,11.58c2.121,14.201,14.065,25.71,26.668,25.71s23.839-5.406,25.08-12.069 c1.256-6.668,2.268-12.075,2.268-12.075C199.935,160.882,231.634,127.513,231.634,79.976z"></path>{" "}
              <path d="M118.42,217.095c-14.359,0-25.993,11.64-25.993,25.999v12.14c0,14.359,11.64,25.999,25.993,25.999 h22.322c14.359,0,25.999-11.64,25.999-25.999v-12.14c0-14.359-11.645-25.999-25.999-25.999H118.42z"></path>{" "}
            </g>{" "}
          </g>
        </svg>
      </div>
      <div
        className={`flex w-full flex-col items-start justify-center gap-1 pr-4 transition-transform sm:items-center sm:gap-2 sm:px-3 ${hover ? "delay-150 duration-400 sm:-translate-y-17" : "delay-0 duration-200 sm:translate-y-0"} relative`}
      >
        <h2 className="text-xs font-medium text-nowrap whitespace-nowrap sm:text-lg">
          {display}
        </h2>
        <div className="line-clamp-3 text-start text-[10px] font-bold text-slate-300 sm:h-[42px] sm:w-3/5 sm:text-center sm:text-sm sm:font-medium">
          {description}
        </div>
      </div>
    </div>
  );
}
