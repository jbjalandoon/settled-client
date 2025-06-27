import { MouseEventHandler, ReactNode } from "react";

export default function MainButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className="font-inter cursor-pointer rounded-2xl bg-indigo-700 px-10 py-5 text-3xl font-bold text-white inset-shadow-sm transition-colors duration-300 ease-linear hover:bg-indigo-900"
    >
      {children}
    </button>
  );
}
