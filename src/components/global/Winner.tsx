import { createPortal } from "react-dom";
import ConfettiExplosion from "react-confetti-explosion";
import Avatar from "../lobby/Avatar";
import { getSessionID } from "../../helper/cookies";

export default function Winner({
  winner,
  message,
}: {
  message: string;
  winner?: string;
}) {
  const id = getSessionID();

  return createPortal(
    <div className="absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center gap-6 bg-black/80">
      {winner && (
        <div className="h-30 w-30">
          <Avatar
            flip={false}
            player={winner}
            className={`outline-5 ${id === winner ? "outline-blue-800" : "outline-red-800"}`}
            changeable={false}
            readyIcon={false}
            ready={false}
          />
        </div>
      )}
      <div className="font-atkinson w-[90%] px-3 text-center text-3xl font-bold text-slate-200">
        {message}
      </div>
      <ConfettiExplosion
        particleCount={300}
        duration={3000}
        className="absolute"
      />
    </div>,
    document.body,
  );
}
