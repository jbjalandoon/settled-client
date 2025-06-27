import { Games } from "../../features/room/roomSlice";
import GameListItem from "./GameListItem";

const AVAILABLE_GAMES: {
  title: Games;
  display: string;
  description: string;
  icon: string;
}[] = [
  {
    title: "typing",
    display: "typing race",
    description: "Type fast enough to make your keyboard scream for mercy.",
    icon: "⌨️",
  },
  {
    title: "memory",
    display: "sequence memory",
    description: "Test your recall—one wrong move and confidence shatters.",
    icon: "🙈",
  },
  {
    title: "connect",
    display: "connect four",
    description: "Plan ahead, four notches in a row wins everything.",
    icon: "🔗",
  },
];

export default function GameLists({ clickable }: { clickable: boolean }) {
  return (
    <div className="relative mb-2 flex h-[calc(100vh-320px)] w-full flex-col gap-1 rounded-t-2xl bg-gray-900 sm:max-h-144 sm:max-w-full lg:max-w-[70%]">
      <span className="font-lucky text-center text-lg tracking-widest text-white">
        Game Selection
      </span>
      <div className="relative h-full w-full overflow-y-auto bg-gray-900">
        <ul className="grid h-auto grid-cols-1 grid-rows-none gap-2 px-5 py-2 sm:grid-cols-3 xl:grid-cols-4">
          {AVAILABLE_GAMES.map((game) => (
            <GameListItem
              key={game.title}
              title={game.title}
              display={game.display}
              description={game.description}
              isClickable={clickable}
            ></GameListItem>
          ))}
        </ul>{" "}
      </div>
    </div>
  );
}
