import { useParams } from "@tanstack/react-router";
import { setName } from "../../api/room";
import {
  ChangeEvent,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "../../app/hooks";
import { changedName } from "../../features/room/roomSlice";
import { useSocket } from "../../hooks/useSocket";

export default function ChangeName({ isJoined }: { isJoined: boolean }) {
  const { socket } = useSocket();
  const [value, setValue] = useState("");
  const [toolTip, setTooltip] = useState(false);
  const dispatch = useAppDispatch();

  const { room } = useParams({ from: "/$room" });

  useEffect(() => {
    function handlePlayerChangeName(id: string, name: string) {
      dispatch(changedName({ id, name }));
    }

    socket.on("player-change-name", handlePlayerChangeName);

    return () => {
      socket.off("player-change-name", handlePlayerChangeName);
    };
  });

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      if (value === "") return;
      await setName(room, value);
      setValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowTooltip: MouseEventHandler<SVGElement> = () => {
    setTooltip(true);
  };
  const handleHideTooltip: MouseEventHandler<SVGElement> = () => {
    setTooltip(false);
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="relative flex items-center justify-center gap-2"
    >
      <input
        placeholder="Change Name"
        value={value}
        onChange={handleValueChange}
        className="font-inter rounded-md bg-[#151725] px-3 py-2 text-white outline-none disabled:cursor-not-allowed"
        disabled={!isJoined}
      />
      <span className="relative">
        {toolTip && (
          <div className="font-inter absolute -top-6 left-1/2 inline -translate-1/2 rounded-xl bg-white px-2 py-1 text-xs text-nowrap whitespace-nowrap select-none">
            Enter your name then press enter.
          </div>
        )}
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          className="h-6 w-6"
          onMouseOver={handleShowTooltip}
          onMouseOut={handleHideTooltip}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Layer_2" data-name="Layer 2">
              <g id="invisible_box" data-name="invisible box">
                <rect width="48" height="48" fill="none"></rect>
              </g>
              <g id="Layer_7" data-name="Layer 7">
                <g>
                  <path d="M24.3,6A11.2,11.2,0,0,0,16,9.3a11,11,0,0,0-3.5,8.2,2.5,2.5,0,0,0,5,0,6.5,6.5,0,0,1,2-4.7A6.2,6.2,0,0,1,24.2,11a6.5,6.5,0,0,1,1,12.9,4.4,4.4,0,0,0-3.7,4.4v3.2a2.5,2.5,0,0,0,5,0V28.7a11.6,11.6,0,0,0,9-11.5A11.7,11.7,0,0,0,24.3,6Z"></path>
                  <circle cx="24" cy="39.5" r="2.5"></circle>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </span>
    </form>
  );
}
