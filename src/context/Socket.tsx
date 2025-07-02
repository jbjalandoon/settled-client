import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import type { Socket as SocketType } from "socket.io-client";
import { socketContext } from "../hooks/useSocket";

export default function Socket({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/game";
  const [socket] = useState<SocketType>(
    io(apiUrl + "game", {
      autoConnect: true,
      withCredentials: true,
      timeout: 2000,
      transports: ["websocket", "polling"],
      reconnection: true,
    }),
  );
  //   const [connected, setConnected] = useState(false);

  useEffect(() => {
    function handleConnect() {
      //   setConnected(true);
      console.log("Socket is connected");
    }

    function handleDisconnect() {
      //   setConnected(false);
      console.log("Socket is disconnected");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();
    return () => {
      if (socket.connected) socket.disconnect();
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  const resetConnection = useCallback(() => {
    if (!socket) return;
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
