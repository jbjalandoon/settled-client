import { ReactNode } from "@tanstack/react-router";

export default function CardMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card-main flex max-h-[90%] flex-col text-white ${className}`}
    >
      {children}
    </div>
  );
}
