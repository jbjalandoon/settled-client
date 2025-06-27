import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Quote from "../../components/typing/Quote";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSessionID } from "../../helper/cookies";
import Avatar from "../../components/lobby/Avatar";
import { useSocket } from "../../hooks/useSocket";
import {
  typingEntryAdded,
  typingFinished,
  TypingGameStats,
  typingUpdateWPM,
} from "./typingSlice";
import Winner from "../../components/global/Winner";
import { playerWon } from "../room/roomSlice";

export default function Typing() {
  const { socket } = useSocket();
  const id = getSessionID();
  const dispatch = useAppDispatch();

  const players = useAppSelector((state) => state.typing!.stats);
  const winner = useAppSelector((state) => state.typing!.details.winner);
  const { startTime } = useAppSelector((state) => state.typing!.details);
  const playerDetail = useAppSelector((state) => state.room!.players);

  const { entry, right, current } = players[id];

  const [error, setError] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00");
  const [input, setInput] = useState<string>("");

  const [typingDisabled, setTypingDisabled] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeElapsedInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    inputElement.current!.focus();

    interval.current = setInterval(() => {
      socket.emit("typing-update-wpm");
    }, 3000);

    timeElapsedInterval.current = setInterval(() => {
      const minute = (Date.now() - startTime!) / 1000 / 60;
      const second = ((Date.now() - startTime!) / 1000) % 60;
      setTimeElapsed(
        `${minute.toFixed(0).padStart(2, "0")} : ${second.toFixed(0).padStart(2, "0")}`,
      );
    }, 1000);

    function handleUpdateEntry(player: string, gameStats: TypingGameStats) {
      if (id === player) {
        setInput("");
        setError(null);
      }
      dispatch(typingEntryAdded({ player, gameStats }));
    }

    function handleUpdateWPM(playersWPM: { wpm: number; player: string }[]) {
      dispatch(typingUpdateWPM(playersWPM));
    }

    function handleTypingFinished(
      id: string,
      newScore: number,
      timeFinished: number,
    ) {
      setTypingDisabled(true);
      socket.off("typing-update-wpm", handleUpdateWPM);
      dispatch(typingFinished({ id, newScore, timeFinished }));
      dispatch(playerWon(id));
    }

    function handleTypingAllFinished() {
      clearInterval(countdownInterval.current!);
      clearInterval(interval.current!);
    }

    socket.on("typing-finished", handleTypingFinished);
    socket.on("typing-update-entry", handleUpdateEntry);
    socket.on("typing-update-wpm", handleUpdateWPM);
    socket.on("typing-all-finished", handleTypingAllFinished);
    return () => {
      socket.off("typing-all-finished", handleTypingAllFinished);
      socket.off("typing-finished", handleTypingFinished);
      socket.off("update-entry", handleUpdateEntry);
      socket.off("typing-update-wpm", handleUpdateWPM);
      clearInterval(interval.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function replaceCurlyQuote(text: string) {
    if (!text) return text;
    return text.replace("“", '"').replace("”", '"');
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setInput(value);

    const last = value.slice(-1);

    if (value.length === 0) {
      setError(null);
      return;
    }

    if (last === " " && value.slice(0, -1) === replaceCurlyQuote(current)) {
      setInput((val) => val.slice(0, -1));
      socket.emit("typing-update-entry", value);
      if (right.length === 0) {
        socket.emit("typing-finished", Date.now());
      }
      return;
    }

    if (
      error === null &&
      last != replaceCurlyQuote(current[value.length - 1])
    ) {
      setError(value.length - 1 < 0 ? null : value.length - 1);
    } else {
      if (error != null) {
        if (
          current[error] === value[error] ||
          error >= value.length ||
          value.length === 0
        ) {
          setError(null);
        }
      }
    }
  };

  return (
    <div className="font-atkinson flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-6 text-2xl text-white sm:justify-center sm:text-2xl">
      {winner && (
        <Winner
          message={`${playerDetail[winner].name} finished the race`}
          winner={winner}
        ></Winner>
      )}
      <span className="self-end">{timeElapsed}</span>
      <div className="h-fit w-full rounded-xl bg-slate-700 p-2">
        <div className="font-atkinson h-full max-h-[6em] min-h-[6em] w-full overflow-hidden rounded-xl px-2 leading-[1.2em] sm:max-h-full">
          <div className="text-left">
            {entry.length > 0 && (
              <Quote content={entry.join(" ")} type={"entry"} />
            )}
            <span className="inline-block">
              {input.length > 0 && (
                <>
                  {error !== null && error < current.length ? (
                    <>
                      <Quote
                        content={(current + " " + right.join(" "))
                          .slice(0, Math.min(current.length, input.length))
                          .slice(0, error)}
                        type={"input-current-correct-error"}
                      />
                      <Quote
                        content={(current + " " + right.join(" "))
                          .slice(0, Math.min(current.length, input.length))
                          .slice(error)}
                        type={"input-current-error-error"}
                      />
                    </>
                  ) : (
                    <Quote
                      content={(current + " " + right.join(" ")).slice(
                        0,
                        Math.min(current.length, input.length),
                      )}
                      type={"input-current-correct"}
                    />
                  )}
                  {current.length < input.length && (
                    <Quote
                      content={(current + " " + right.join(" ")).slice(
                        current.length,
                        input.length,
                      )}
                      type={"error"}
                    />
                  )}
                </>
              )}
              {input.length < current.length && (
                <Quote
                  content={(current + " " + right.join(" "))[input.length]}
                  type={"current"}
                />
              )}
              {input.length === current.length && (
                <Quote content={" "} type={"current-space"} />
              )}
              {current.slice(input.length + 1) && (
                <Quote
                  content={current.slice(input.length + 1)}
                  type={"post-current"}
                />
              )}
            </span>
            {input.length > current.length && (
              <Quote
                content={(current + " " + right.join(" "))[input.length]}
                type={"current-error"}
              />
            )}
            <span>
              {current.length > input.length && " "}
              {right
                .join(" ")
                .slice(
                  input.length > current.length
                    ? input.length - current.length
                    : 0,
                )}
            </span>
          </div>
        </div>{" "}
      </div>
      <input
        ref={inputElement}
        type="text"
        className="w-full rounded-md border-2 p-2 text-lg tracking-wider outline-none"
        value={input}
        onChange={handleInputChange}
        disabled={typingDisabled}
      />
      <div className="mt-10 flex w-full flex-col gap-10">
        {Object.keys(players)
          .sort((el) => (el === id ? -1 : 1))
          .map((el) => {
            const stats = players[el];
            return (
              <div className="flex items-center gap-5" key={el}>
                <div
                  className="relative flex w-full items-center justify-center gap-10 border-b-1 p-2 pb-3 underline"
                  key={`stats${el}`}
                >
                  <div className="relative h-16 w-full gap-10">
                    <div
                      className="absolute flex h-auto w-auto flex-col items-center justify-center gap-3 text-center text-xl transition-all"
                      style={{
                        left:
                          Math.floor(
                            (stats.entry.length /
                              (stats.entry.length + stats.right.length + 1)) *
                              100,
                          ) + "%",
                      }}
                    >
                      <Avatar
                        flip={true}
                        player={el}
                        className={`h-16 w-16 outline-5 ${el === id ? "outline-blue-800" : "outline-red-800"}`}
                        changeable={false}
                        readyIcon={false}
                        ready={false}
                      />
                      <span className="w-[8ch]">{playerDetail[el].name}</span>
                    </div>
                  </div>
                </div>
                <span className="hidden w-fit whitespace-nowrap sm:inline">
                  {stats.wpm.toFixed(0)} WPM
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
