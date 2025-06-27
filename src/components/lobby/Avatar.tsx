import { adventurerNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { avatarChanged } from "../../features/room/roomSlice";
import { useSocket } from "../../hooks/useSocket";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaX, FaCheck } from "react-icons/fa6";

export const SEED = [
  "Aidan",
  "Aiden",
  "Adrian",
  "Alexander",
  "Amaya",
  "Andrea",
  "Avery",
  "Brian",
  "Destiny",
  "Brooklynn",
];

export default function Avatar({
  flip,
  className,
  changeable,
  player,
  readyIcon,
  ready,
}: {
  flip: boolean;
  player: string;
  className: string;
  changeable: boolean;
  readyIcon: boolean;
  ready: boolean;
  score?: number;
}) {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const avatarNumber = useAppSelector((state) => {
    if (!player) {
      return 0;
    } else {
      return state.room!.players[player].avatar;
    }
  });
  useEffect(() => {
    function handleAvatarChange(player: string, avatar: number) {
      dispatch(avatarChanged({ player, avatar }));
    }

    socket.on("avatar-change", handleAvatarChange);

    return () => {
      socket.off("avatar-change", handleAvatarChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      seed: SEED[avatarNumber],
      randomizeIds: true,
      flip,
      scale: 80,
      radius: 50,
      //
      // ... other options
    }).toDataUri();
  }, [avatarNumber, flip]);

  const handleImageClick = () => {
    socket.emit("avatar-change", (avatarNumber + 1) % (SEED.length + 1));
  };

  return (
    <div className={`rounded-full ${className}`}>
      <img src={avatar} className="select-none" draggable={false} />
      {changeable && (
        <button
          className="xs:h-6 xs:w-6 xs:right-2 xs:bottom-2 absolute right-1 bottom-1 flex h-5 w-5 translate-1/2 cursor-pointer items-center justify-center rounded-full bg-blue-900 p-1 text-lg text-white select-none sm:right-3 sm:h-8 sm:w-8"
          onClick={handleImageClick}
        >
          <FaArrowsRotate />
        </button>
      )}
      {!changeable && readyIcon && (
        <>
          <div
            className={`absolute -bottom-1 flex h-6 w-6 items-center justify-center rounded-full p-1 font-bold text-white transition-colors duration-150 sm:h-8 sm:w-8 ${ready ? "bg-green-900" : "bg-red-900"} ${flip ? "left-2.5 -translate-x-1/2" : "right-2.5 translate-x-1/2"}`}
          >
            {ready ? (
              <FaCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <FaX className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
