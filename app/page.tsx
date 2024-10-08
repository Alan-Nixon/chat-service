/* eslint-disable */
"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import NavBar from "./components/Navbar";
import SideUsers from "./components/SideUsers";
import SingleChat from "./components/SingleChat";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoadingPage } from "./components/Loading";
import { IChat, IUser } from "@/interfaces/interface_types";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [sideBarShow, setSideBarShow] = useState(true);
  const [selectedUser, setSelectedUser] = useState<null | IUser>(null);
  const [messages, setMessages] = useState<IChat[]>([]);
  const navBarRef = useRef();
  const socket = useSocket();

  useEffect(() => {
    if (session) {
      console.log(session);
      setLoading(false);
      if (socket)
        socket.emit("log_online", { lastSeen: "online", userId: session._id });
    } else {
      if (status !== "loading") {
        router.push("/login");
        setLoading(false);
      }
    }
  }, [session, status, socket]);

  if (loading) {
    return <LoadingPage />;
  }

  const singleChatProps = { messages, selectedUser, setMessages, navBarRef };
  const sideChatProps = { setSelectedUser, setMessages };
  const onToggleSidebar = () => setSideBarShow(!sideBarShow);

  return (
    <>
      <NavBar navBarRef={navBarRef} onToggleSidebar={onToggleSidebar} />
      <div className="flex">
        {sideBarShow && <SideUsers Data={sideChatProps} />}
        {selectedUser ? (
          <SingleChat Data={singleChatProps} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </>
  );
}

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
