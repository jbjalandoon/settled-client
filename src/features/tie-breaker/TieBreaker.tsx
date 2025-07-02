import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Avatar from "../../components/lobby/Avatar";
import { getSessionID } from "../../helper/cookies";
import {
  tieBreakerAddPoint,
  TieBreakerChoices,
  tieBreakerReset,
  tieBreakerReveal,
  tieBreakerWinner,
  toggleLockIn,
} from "./tieBreakerSlice";
import { useSocket } from "../../hooks/useSocket";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  FaLock,
  FaLockOpen,
  FaRegStar,
  FaRegHandRock,
  FaRegHandPaper,
  FaQuestion,
  FaRegHandScissors,
  FaStar,
} from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import Winner from "../../components/global/Winner";
import { playerWon } from "../room/roomSlice";

export function TieBreaker() {
  const id = getSessionID();
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const players = useAppSelector((state) => state.room!.players);
  const winner = useAppSelector((state) => state.tieBreaker!.details.winner);
  const stats = useAppSelector((state) => state.tieBreaker!.stats);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [activeChoice, setActiveChoice] = useState<TieBreakerChoices>(
    stats[id].chosen || "rock",
  );
  const opponent = Object.keys(players).filter((el) => el !== id)[0];

  useEffect(() => {
    function handleToggleLockIn(
      userId: string,
      chosen: TieBreakerChoices | null,
    ) {
      dispatch(toggleLockIn({ id: userId, chosen }));
      console.log("listened");
    }

    function handleAddPoints(
      winner: string,
      chosen: { [key in string]: TieBreakerChoices },
    ) {
      setReveal(true);
      dispatch(tieBreakerAddPoint({ winner }));
      setRoundWinner(winner);
      dispatch(tieBreakerReveal(chosen));
    }

    function handleDraw(chosen: { [key in string]: TieBreakerChoices }) {
      setReveal(true);
      console.log(chosen);
      dispatch(tieBreakerReveal(chosen));
    }

    function handleReset() {
      setReveal(false);
      setRoundWinner(null);
      dispatch(tieBreakerReset());
    }

    function handleWinner(winner: string) {
      dispatch(tieBreakerWinner(winner));
      dispatch(playerWon(winner));
    }

    socket.on("toggle-lock-in", handleToggleLockIn);
    socket.on("tie-breaker-add-points", handleAddPoints);
    socket.on("tie-breaker-reset", handleReset);
    socket.on("tie-breaker-draw", handleDraw);
    socket.on("tie-breaker-winner", handleWinner);

    return () => {
      socket.off("toggle-lock-in", handleToggleLockIn);
      socket.off("tie-breaker-add-points", handleAddPoints);
      socket.off("tie-breaker-reset", handleReset);
      socket.off("tie-breaker-draw", handleDraw);
      socket.off("tie-breaker-winner", handleWinner);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLockIn() {
    dispatch(toggleLockIn({ id, chosen: activeChoice }));
    console.log("button clicked");
    socket.emit("tie-breaker-lock-in", activeChoice);
  }

  return (
    <div className="flex h-full w-full flex-col-reverse items-center justify-center gap-13 p-5">
      {winner && (
        <Winner message={`${players[winner].name} won the tie-breaker`} />
      )}
      <div className="flex h-auto flex-col items-center justify-center gap-5">
        {reveal || stats[id].lockedIn ? (
          <div className="flex items-center justify-center p-3 text-4xl sm:text-9xl">
            <ChoiceImage choice={stats[id].chosen!} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-7">
            <ChoiceItem
              choice={"rock"}
              active={activeChoice === "rock"}
              setActiveChoice={setActiveChoice}
            />
            <ChoiceItem
              choice={"paper"}
              active={activeChoice === "paper"}
              setActiveChoice={setActiveChoice}
            />
            <ChoiceItem
              choice={"scissor"}
              active={activeChoice === "scissor"}
              setActiveChoice={setActiveChoice}
            />
          </div>
        )}
        <div className="flex flex-row items-center gap-3">
          <Avatar
            flip={true}
            player={id}
            className={"h-17 w-17 outline-5 outline-blue-800"}
            changeable={false}
            readyIcon={false}
            ready={false}
          />
          <div className="flex flex-col items-center text-xl">
            <div className="ga-3 flex flex-row gap-1">
              {new Array(3).fill(1).map((_, i) => {
                return i < stats[id].score ? (
                  <FaStar key={`start-${i}-${id}`} />
                ) : (
                  <FaRegStar key={`start-${i}-${id}`} />
                );
              })}
            </div>
            <span className="w-[9ch] text-center">{players[id].name}</span>
          </div>
        </div>
        <button
          className="py3 flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-blue-900 disabled:cursor-not-allowed"
          onClick={handleLockIn}
        >
          {!stats[id].lockedIn ? <FaLock /> : <FaLockOpen />}
          {!stats[id].lockedIn ? "Lock in" : "Cancel"}
        </button>
      </div>
      <span className="font-atkinson text-center text-xl font-bold uppercase">
        {!reveal ? (
          <>
            <BeatLoader className="h-[1em]" color="#ffffff" />
          </>
        ) : (
          <>
            {roundWinner
              ? `YOU ${roundWinner === id ? "WIN" : "LOSE"}`
              : `DRAW`}
          </>
        )}
      </span>
      <div className="flex h-auto flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <Avatar
            flip={false}
            player={opponent}
            className={"h-17 w-17 outline-5 outline-blue-800"}
            changeable={false}
            readyIcon={false}
            ready={false}
          />
          <div className="flex flex-col items-center justify-center text-xl">
            <div className="ga-3 flex flex-row gap-1">
              {new Array(3).fill(1).map((_, i) => {
                return i < stats[opponent].score ? (
                  <FaStar key={`start-${i}-${opponent}`} />
                ) : (
                  <FaRegStar key={`start-${i}-${opponent}`} />
                );
              })}
            </div>
            <span className="w-[9ch] text-center">
              {players[opponent].name}
            </span>
          </div>
        </div>
        {reveal ? (
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 text-4xl sm:p-5 sm:text-9xl">
              <ChoiceImage choice={stats[opponent].chosen!} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {!stats[opponent].lockedIn ? (
              <>
                <div className="p-3 text-4xl sm:p-5 sm:text-9xl">
                  <FaQuestion />
                </div>
              </>
            ) : (
              <>
                <div className="p-3 text-4xl sm:p-5 sm:text-9xl">
                  <FaQuestion />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceItem({
  choice,
  active,
  setActiveChoice,
}: {
  choice: TieBreakerChoices;
  active: boolean;
  setActiveChoice: Dispatch<SetStateAction<TieBreakerChoices>>;
}) {
  return (
    <button
      className={`text-shadow-g cursor-pointer p-3 text-4xl text-shadow-black sm:p-3 sm:text-9xl ${active ? "outline-2" : "outline-none"}`}
      onClick={() => {
        setActiveChoice(choice);
      }}
    >
      <ChoiceImage choice={choice} />
    </button>
  );
}

function ChoiceImage({ choice }: { choice: TieBreakerChoices }) {
  let image: ReactNode | null = null;

  switch (choice) {
    case "rock":
      image = <FaRegHandRock />;
      break;
    case "paper":
      image = <FaRegHandPaper />;
      break;
    case "scissor":
      image = <FaRegHandScissors />;
      break;
  }

  return image;
}
