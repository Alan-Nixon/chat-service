"use client"
import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import SideUsers from './components/SideUsers'
import SingleChat from './components/SingleChat'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingPage } from './components/Loading';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true)


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
        <SideUsers />
        <SingleChat />
      </div>
    </>
  );
}
