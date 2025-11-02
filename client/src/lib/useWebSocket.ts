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
    async function fetchInitial() {
      try {
        const [usersRes, battlesRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/battles")
        ]);
        const [users, battles] = await Promise.all([usersRes.json(), battlesRes.json()]);
        setData({ users, battles });
      } catch (err) {
        console.error("Failed initial fetch:", err);
      }
    }

    fetchInitial();

    const newSocket = io({ path: "/socket.io" });

    newSocket.on("connect", () => setConnected(true));
    newSocket.on("disconnect", () => setConnected(false));

    newSocket.on("user:created", (user) => {
      setData(prev => ({ ...prev, users: [...prev.users, user] }));
    });

    // newSocket.on("user:updated", (updatedUser) => {
    //   setData(prev => ({
    //     ...prev,
    //     users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    //   }));
    // });

    // newSocket.on("battle:created", (battle) => {
    //   setData(prev => ({
    //     ...prev,
    //     battles: [battle, ...prev.battles.slice(0, 9)]
    //   }));
    // });

    setSocket(newSocket);

    return () => {newSocket.close()};
  }, []);

  return { data, connected, socket };
}
