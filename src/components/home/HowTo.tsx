import { useEffect, useState } from "react";

const HOW_TO_PLAY = [
  {
    title: "Select Games",
    img: "https://picsum.photos/500/250",
    description: "Select the games you want to play",
  },
  {
    title: "Win",
    img: "https://picsum.photos/500/250",
    description: "Win the game to gain points",
  },
  {
    title: "Tie?",
    img: "https://picsum.photos/500/250",
    description: "Play with classic rock-paper-scissor",
  },
  {
    title: "Win!",
    img: "https://picsum.photos/500/250",
    description: "It's settled, the winner is the better",
  },
];

export default function HowTo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % HOW_TO_PLAY.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [active]);

  return (
    <div className="flex h-auto w-1/2 flex-col items-center rounded-xl border py-4 text-center text-white">
      <h2 className="font-lucky text-3xl font-bold">How to Play</h2>
      <div className="mt-6 flex flex-col items-center">
        <img src={HOW_TO_PLAY[active].img} className="h-65 w-130" />
        <h1 className="mt-6 text-4xl font-bold">
          {active + 1}. {HOW_TO_PLAY[active].title}
        </h1>
        <p className="mt-5 text-center text-2xl">
          {HOW_TO_PLAY[active].description}
        </p>
      </div>
      <div className="mt-6 mb-3 flex items-center gap-5 pb-5">
        {HOW_TO_PLAY.map((el, index) => (
          <button
            className={`rounded-full bg-white ${index === active ? "h-5 w-5" : "h-4 w-4"} cursor-pointer transition-all`}
            key={el.title}
            onClick={() => {
              setActive(index);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
