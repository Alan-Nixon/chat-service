"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';

function NavBar() {
    const { data: session } = useSession();
    return (
        <nav className='w-full h-16 border-b-2 bg-[#303033]' >
            <div className="flex ml-5 mr-5">

                <p className='font-bold text-2xl mt-4' >AV CHAT SERVICE </p>
                <div className="m-auto">
                    <p className='font-bold text-center text-xl ml-36 mt-4' >{session?.userName?.toUpperCase() + ""}</p>
                </div>
                <button className='ml-auto font-bold mt-2' onClick={() => signOut()} >Logout <LogoutIcon /></button>
            </div>
        </nav>
    )
}

export default NavBar
