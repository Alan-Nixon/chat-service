"use client"
import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import SideUsers from './components/SideUsers'
import SingleChat from './components/SingleChat'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingPage } from './components/Loading';
import { IChat, IUser } from '@/interfaces/interface_types';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<null | IUser>(null);
  const [messages, setMessages] = useState<IChat[]>([])

  useEffect(() => {
    console.log(session, status)
    if (session) { setLoading(false) }
    else {
      if (status !== "loading") {
        router.push("/login")
        setLoading(false)
      }
    }

  }, [session, status])

  if (loading) { return <LoadingPage /> }

  return (
    <>
      <NavBar />
      <div className="flex">
        <SideUsers setSelectedUser={setSelectedUser} setMessages={setMessages} />
        {selectedUser ? <SingleChat messages={messages} selectedUser={selectedUser} /> : <img src="/images/welcome.avif" className='w-full' alt="" />}
      </div>
    </>
  );
}
