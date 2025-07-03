import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import type { Socket as SocketType } from "socket.io-client";
import { socketContext } from "../hooks/useSocket";
import { useLocation } from "@tanstack/react-router";

export default function Socket({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/game";
  const path = useLocation({ select: (location) => location.pathname });
  const [socket] = useState<SocketType>(
    io(apiUrl + "game", {
      autoConnect: false,
      withCredentials: true,
      timeout: 3000,
      transports: ["websocket"],
      reconnection: true,
      upgrade: true,
    }),
  );
  //   const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [path, socket]);

  useEffect(() => {
    function handleConnect() {
      console.log("connected");
      //   setConnected(true);
    }

    function handleDisconnect() {
      console.log("disconnected");
      //   setConnected(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    // socket.connect();
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      // socket.disconnect();
    };
  }, []);

  const resetConnection = useCallback(() => {
    if (!socket) return;
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  }, [socket]);

  const contextValue = useMemo(
    () => ({
      socket: socket,
      resetSocket: resetConnection,
    }),
    [resetConnection, socket],
  );
  return (
    <socketContext.Provider value={contextValue}>
      {children}
    </socketContext.Provider>
  );
}
