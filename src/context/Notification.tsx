import { Dispatch, SetStateAction, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Notification({
  value,
  setError,
}: {
  value: string;
  setError: Dispatch<SetStateAction<string>>;
}) {
  useEffect(() => {
    const delay = setTimeout(() => {
      setError("");
    }, 3000);

    return () => {
      clearTimeout(delay);
    };
  }, [setError, value]);

  if (value === "") {
    return null;
  }

  return createPortal(
    <div className="absolute top-15 right-15 z-999 w-auto rounded-2xl bg-red-800 p-7 text-xl whitespace-nowrap text-white">
      {value}
    </div>,
    document.body,
  );
}
