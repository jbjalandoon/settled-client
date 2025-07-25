import {
  ChangeEventHandler,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { MdLoop } from "react-icons/md";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { FaPlay } from "react-icons/fa";
import { SEED } from "../lobby/Avatar";
import { createRoom, joinRoom } from "../../api/room";
import { useNavigate } from "@tanstack/react-router";
import { ClipLoader } from "react-spinners";

type Menu = "play" | "join" | "credits" | "about";

export default function Menu() {
  const [menu, setMenu] = useState<Menu>("play");
  let render: ReactNode | null = null;

  switch (menu) {
    case "play":
      render = <Play />;
      break;
    case "join":
      render = <Join />;
      break;
    case "about":
      render = <About />;
      break;
    case "credits":
      render = <Credits />;
      break;
  }

  return (
    <div className="flex w-full flex-col items-center gap-1 self-start">
      <MenuList menu={menu} setMenu={setMenu} />
      {render}
    </div>
  );
}

function Credits() {
  return (
    <div className="flex w-full flex-col items-center gap-7">
      <ul className="flex flex-col gap-3 text-center">
        <li>
          <p className="font-inter text-lg">
            “Adventurer Neutral” by{" "}
            <a
              href="https://www.instagram.com/lischi_art/"
              className="text-blue-800 underline"
            >
              Lisa Wischofsky
            </a>{" "}
            used as avatar, license under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              rel="license"
              className="text-blue-800 underline"
            >
              CC BY 4.0
            </a>
          </p>
        </li>
      </ul>
    </div>
  );
}

function About() {
  return (
    <div className="flex w-full flex-col items-center gap-7">
      <p className="font-inter track-wide w-full rounded-xl px-2 py-3 text-center text-xl sm:w-1/2">
        Hi! I'm Jerome, This is where I compile a simple 1 vs 1 game to play
        with your friend.
      </p>
    </div>
  );
}

function AvatarMenu({
  avatarNumber,
  children,
}: {
  avatarNumber: number;
  children: ReactNode;
}) {
  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      seed: SEED[avatarNumber],
      randomizeIds: true,
      scale: 80,
      radius: 50,
      //
      // ... other options
    }).toDataUri();
  }, [avatarNumber]);
  return (
    <div className="relative h-25 w-25 rounded-full border-6 sm:h-32 sm:w-32">
      <img src={avatar} className="select-none" draggable={false} />
      {children}
    </div>
  );
}

function Play() {
  const [avatarNumber, setAvatarNumber] = useState<number>(0);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate({ from: "/" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateRoom() {
    try {
      setIsSubmitting(true);
      const { data, status } = await createRoom(nickname, avatarNumber);

      if (status === 500) {
        return;
      }
      await navigate({ to: "/$room", params: { room: data.id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setIsSubmitting(false);
    }
  }
  const handleChangeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.currentTarget.value);
  };

  const handleChangeAvatar = () => {
    setAvatarNumber((prev) => (prev + 1) % SEED.length);
  };

  return (
    <div className="flex w-full flex-col items-center gap-7 sm:gap-10">
      <AvatarMenu avatarNumber={avatarNumber}>
        <button
          className="absolute -right-3 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-700 p-1 text-3xl hover:bg-blue-600 disabled:cursor-not-allowed"
          onClick={handleChangeAvatar}
          disabled={isSubmitting}
        >
          <MdLoop />
        </button>
      </AvatarMenu>
      <input
        type="text"
        className="w-full max-w-[18ch] rounded-xl border-4 border-slate-400 bg-gray-700/80 px-2 py-1 text-lg text-slate-300 outline-none focus:border-slate-100 focus:bg-slate-700/30 focus:text-slate-200 sm:max-w-[32ch]"
        placeholder="YourCoolNameHere231"
        onChange={handleChangeNickname}
      />
      <button
        className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-slate-600 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-slate-700 disabled:cursor-not-allowed"
        disabled={isSubmitting}
        onClick={handleCreateRoom}
      >
        {isSubmitting ? (
          <ClipLoader color="white" />
        ) : (
          <>
            <FaPlay />
            Play
          </>
        )}
      </button>
    </div>
  );
}

function Join() {
  const [avatarNumber, setAvatarNumber] = useState<number>(0);
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate({ from: "/" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateRoom() {
    try {
      setIsSubmitting(true);
      const { status } = await joinRoom(room, nickname, avatarNumber);

      if (status !== 201) {
        return;
      }

      await navigate({ to: "/$room", params: { room } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-5">
        <div>
          <AvatarMenu avatarNumber={avatarNumber}>
            <button
              className="absolute -right-3 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-700 p-1 text-3xl hover:bg-blue-600 disabled:cursor-not-allowed"
              onClick={() => {
                setAvatarNumber((prev) => (prev + 1) % SEED.length);
              }}
              disabled={isSubmitting}
            >
              <MdLoop />
            </button>
          </AvatarMenu>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <input
            type="text"
            className="w-full max-w-[18ch] rounded-xl border-4 border-slate-400 bg-gray-700/80 px-2 py-1 text-lg text-slate-300 outline-none focus:border-slate-100 focus:bg-slate-700/30 focus:text-slate-200"
            placeholder="NiceName"
            value={nickname}
            onChange={(e) => setNickname(e.currentTarget.value)}
          />
          <input
            type="text"
            className="w-full max-w-[18ch] rounded-xl border-4 border-slate-400 bg-gray-700/80 px-2 py-1 text-lg text-slate-300 outline-none focus:border-slate-100 focus:bg-slate-700/30 focus:text-slate-200"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.currentTarget.value)}
          />
        </div>
      </div>
      <button
        className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-slate-600 px-3 py-2 text-lg font-bold text-white shadow-lg shadow-black hover:bg-slate-700 disabled:cursor-not-allowed"
        disabled={isSubmitting}
        onClick={handleCreateRoom}
      >
        {!isSubmitting ? (
          <>
            <FaPlay />
            Join
          </>
        ) : (
          "Join Room"
        )}
      </button>
    </div>
  );
}

function MenuList({
  menu,
  setMenu,
}: {
  menu: Menu;
  setMenu: Dispatch<SetStateAction<Menu>>;
}) {
  return (
    <div className="mx-auto flex w-full items-center justify-center gap-4 self-center py-5 text-center">
      <MenuListItem
        onClick={() => setMenu("play")}
        text={"Play"}
        isActive={menu === "play"}
      />
      <MenuListItem
        onClick={() => setMenu("join")}
        text={"Join"}
        isActive={menu === "join"}
      />
      <MenuListItem
        onClick={() => setMenu("about")}
        text={"About"}
        isActive={menu === "about"}
      />
      <MenuListItem
        onClick={() => setMenu("credits")}
        text={"Credits"}
        isActive={menu === "credits"}
      />
    </div>
  );
}

function MenuListItem({
  onClick,
  text,
  isActive,
}: {
  onClick: () => void;
  text: string;
  isActive: boolean;
}) {
  return (
    <h1
      className={`font-dyna xs:text-xl relative w-auto cursor-pointer text-lg whitespace-nowrap transition-all before:absolute before:-bottom-1 before:left-0 before:h-1 before:w-full before:bg-white before:transition-transform before:duration-500 hover:before:scale-x-100 sm:text-2xl ${isActive ? "before:scale-x-100" : "before:scale-x-0"}`}
      onClick={() => onClick()}
    >
      {text}
    </h1>
  );
}
