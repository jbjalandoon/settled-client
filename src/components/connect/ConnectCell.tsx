import { useAppSelector } from "../../app/hooks";
import Avatar from "../lobby/Avatar";
import { FaLongArrowAltDown } from "react-icons/fa";
import { useSocket } from "../../hooks/useSocket";
import { getSessionID } from "../../helper/cookies";
import { Dispatch, SetStateAction } from "react";

export default function ConnectCell({
  col,
  row,
  value,
  disabled,
  winningTile,
  setHoveredCell,
}: {
  col: number;
  row: number;
  value: string | null;
  disabled: boolean;
  winningTile: boolean;
  setHoveredCell: Dispatch<SetStateAction<null | number[]>>;
}) {
  const { socket } = useSocket();
  const grid = useAppSelector((state) => state.connect!.details.grid);
  const id = getSessionID();

  function handleClick() {
    if (disabled) return;
    for (let r = 5; r >= 0; r--) {
      if (!grid[r][col]) {
        socket.emit("connect-drop", r, col);
        break;
      }
    }
  }

  return (
    <div
      className={`relative h-full w-full self-center rounded-full bg-[#1a1d2e] inset-shadow-sm inset-shadow-black ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${winningTile ? "shadow-avatar scale-110" : "scale-100 shadow-none"}`}
      onClick={handleClick}
      onMouseEnter={() => {
        if (disabled) return;
        for (let r = 5; r >= 0; r--) {
          if (!grid[r][col]) {
            setHoveredCell([r, col]);
            break;
          }
        }
      }}
      onMouseLeave={() => {
        if (disabled) return;
        setHoveredCell(null);
      }}
    >
      {!value && row === 0 && !disabled && (
        <div className="xs:text-lg absolute top-1/2 left-1/2 -translate-1/2 animate-bounce text-sm sm:text-xl md:text-3xl">
          <FaLongArrowAltDown />
        </div>
      )}
      {value && (
        <div className="relative h-full w-full">
          <Avatar
            flip={false}
            player={value}
            className={`absolute top-1/2 left-1/2 h-[94%] w-[94%] -translate-1/2 border-white outline-5 ${id === value ? "outline-blue-800" : "outline-red-800"} outline-2`}
            changeable={false}
            readyIcon={false}
            ready={false}
          />
        </div>
      )}
    </div>
  );
}
