import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketData {
  users: any[];
  battles: any[];
}

export function useWebSocket() {
  const [data, setData] = useState<WebSocketData>({ users: [], battles: [] });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io({
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    });

    newSocket.on("update", (updateData: WebSocketData) => {
      setData(updateData);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { data, connected, socket };
}
