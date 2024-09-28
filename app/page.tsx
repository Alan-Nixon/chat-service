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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session) {
      setLoading(false);
    } else {
      if (status !== "loading") {
        router.push("/login");
        setLoading(false);
      }
    }
  }, [session, status]);

  // Initialize socket connection
  // useEffect(() => {
  //   const socketUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'; // Ensure the URL is correct
  //   const socketConnection = io(socketUrl, {
  //     path: '/api/users/socket', // Match the backend socket path
  //   });

  //   setSocket(socketConnection);

  //   // Listen to incoming messages
  //   socketConnection.on('message', (msg: string) => {
  //     console.log('Message received:', msg);
  //   });

  //   // Cleanup socket connection when component unmounts
  //   return () => {
  //     socketConnection.disconnect();
  //   };
  // }, []);

  if (loading) { return <LoadingPage /> }

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
