"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IUser, SideUsersProps } from '../../interfaces/interface_types'
import { getChat, getUsers } from '../(functions)/Function'
import { useSession } from 'next-auth/react'


function page({ setSelectedUser }: SideUsersProps) {
  const [sideBarData, setSideBarData] = useState<IUser[]>([]);
  const { data: user } = useSession()

  useEffect(() => {
    getUsers().then(({ data }: { data: IUser[] }) => {
      setSideBarData(data.filter(item => item._id !== user?._id))
    });
  }, [])

  const selectUser = (userData: IUser) => {
    setSelectedUser(userData);
    getChat(user?._id + "", userData._id+"").then((data) => {
      console.log(data)
    })
  }

  return (
    <aside className='w-[25%] h-[93vh] bg-[#303033] border-r-2'>
      <h2 className='mt-1 text-2xl font-bold text-center'>Chats</h2>
      <div className='messageBar w-auto h-[85vh] overflow-auto'>
        {sideBarData.map((item, index) => (
          <div key={index} onClick={() => selectUser(item)} className='p-3 mt-2 hover:bg-[#424242] flex'>
            <Image src={item.profileImage} alt='' width={50} height={50} className='rounded-full' />
            <div className="ml-3">
              <h1 className={(item.lastMessage ? "" : "mt-3") + " font-bold"}>{item.userName}</h1>
              <p>{item.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>

  )
}

export default page
