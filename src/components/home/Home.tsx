import { useAppDispatch } from "../../app/hooks";
import { leaveRoomURL } from "../../features/room/roomSlice";
import Menu from "./Menu";
import { useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import Logo from "../global/Logo";

export default function Home() {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(leaveRoomURL());
    socket.emit("leave-room");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full w-full py-15 text-white">
      <Logo svgClassName="h-auto w-50 xs:w-70 sm:w-80 md:w-90"></Logo>
      <div className="mt-3 flex w-full justify-center">
        <Menu />
      </div>
    </div>
  );
}
