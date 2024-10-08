"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: user } = useSession();

  useEffect(() => {
    if (user) {
      const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL);
      setSocket(socketConnection);
      socketConnection.emit("join", user?._id + "");

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [user]);

  return socket;
}
