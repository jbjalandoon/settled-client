import { useState } from "react";

export default function Tile({
  active,
  onClick,
  gameActive,
}: {
  active: boolean;
  onClick: () => void;
  gameActive: boolean;
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    onClick();

    setClicked(true);
    await new Promise((res) => setTimeout(res, 20));
    setClicked(false);
    await new Promise((res) => setTimeout(res, 20));
  };

  return (
    <div
      className={`aspect-square h-full w-full rounded-lg shadow-2xl ${active || clicked ? "bg-slate-400" : "bg-slate-600"} ${gameActive ? "cursor-pointer" : "cursor-not-allowed"}`}
      onClick={handleClick}
    ></div>
  );
}
