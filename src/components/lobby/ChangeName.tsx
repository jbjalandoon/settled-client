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

  return (
    <form
      onSubmit={handleSubmitForm}
      className="relative flex items-center justify-center gap-2"
    >
      <input
        placeholder="Change Name"
        value={value}
        onChange={handleValueChange}
        className="font-inter rounded-md bg-[#151725] px-2 py-1 text-white outline-none disabled:cursor-not-allowed"
        disabled={!isJoined}
      />
    </form>
  );
}
