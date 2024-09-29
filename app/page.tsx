"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NavBar from './components/Navbar';
import SideUsers from './components/SideUsers';
import SingleChat from './components/SingleChat';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingPage } from './components/Loading';
import { IChat, IUser } from '@/interfaces/interface_types';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [sideBarShow, setSideBarShow] = useState(true)
  const [selectedUser, setSelectedUser] = useState<null | IUser>(null);
  const [messages, setMessages] = useState<IChat[]>([]);
  const socket = useSocket()

  useEffect(() => {
    if (session) {
      setLoading(false);
      if (socket)
        socket.emit("log_online", { lastSeen: "online", userId: session._id })

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

  return (
    <>
      <NavBar onToggleSidebar={() => { setSideBarShow(!sideBarShow) }} />
      <div className="flex">
        {sideBarShow && <SideUsers setSelectedUser={setSelectedUser} setMessages={setMessages} />}
        <SingleChat messages={messages} selectedUser={selectedUser} setMessages={setMessages} />
      </div>
    </>
  );
}


export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: user } = useSession()
  useEffect(() => {
    if (user) {
      const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL)

      setSocket(socketConnection)
      socketConnection.emit("join", user?._id + "")

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [user]);

  return socket
}