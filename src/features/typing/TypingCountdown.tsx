import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";

export default function TypingCountdown() {
  const [timeElapsed, setTimeElapsed] = useState<string>("00 : 00");
  const { startTime } = useAppSelector((state) => state.typing!.details);

  useEffect(() => {
    const interval = setInterval(() => {
      const minute = (Date.now() - startTime!) / 1000 / 60;
      const second = ((Date.now() - startTime!) / 1000) % 60;
      setTimeElapsed(
        `${minute.toFixed(0).padStart(2, "0")} : ${second.toFixed(0).padStart(2, "0")}`,
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span className="self-end">{timeElapsed}</span>;
}
