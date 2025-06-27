import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export const socketContext = createContext<{
  socket: null | Socket;
  resetSocket: () => void;
}>({
  socket: null,
  resetSocket: () => {},
});

export const useSocket = () => {
  const { socket, resetSocket } = useContext(socketContext);

  if (!socket) {
    throw new Error("Socket is not loaded?");
  }

  return { socket, resetSocket };
};
