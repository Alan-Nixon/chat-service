"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { chatSideBarType } from '../app/interface_types'

const sideBarDataDummy: chatSideBarType[] = new Array(25).fill({
    profileImage: "data:image/jpeg;base64,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",
    userName: "Alan Nixon",
    lastMessage: "you : bye alan nixon"
})

function page() {

    const [sideBarData, setSideBarData] = useState<chatSideBarType[]>([])

    useEffect(() => {
        setSideBarData(sideBarDataDummy)
    }, [])

    return (
        <aside className='w-[25%] h-[93vh] bg-[#303033] border-r-2'>
        <h2 className='mt-1 text-2xl font-bold text-center'>Chats</h2>
        <div className='messageBar w-auto h-[85vh] overflow-auto'>
          {sideBarData.map((item, index) => (
            <div key={index} className='p-3 mt-2 hover:bg-[#424242] flex'>
              <Image src={item.profileImage} alt='' width={50} height={50} className='rounded-full' />
              <div className="ml-3">
                <h1 className="font-bold">{item.userName}</h1>
                <p>{item.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
      
    )
}

export default page
