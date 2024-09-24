"use client";
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import { getTimeDifference } from '@/app/(functions)/Function';
import dynamic from 'next/dynamic';
import data from '@emoji-mart/data';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Image from 'next/image';
import { IChat, IUser } from '@/interfaces/interface_types';
import { useSession } from 'next-auth/react';

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

function page({ selectedUser, messages }: { selectedUser: IUser, messages: IChat[] }) {
  const [selectEmoji, setSelectEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const { data: user } = useSession()

  const sendMessage = async () => {
    if (message.trim() !== "") {
      // const data = await sendMessagePost({
      //   message, type: "text", from: user._id + "", to: selectedUser._id + "", seen: false
      // })
    }
  }

  return (
    <main className="w-[75%]">
      <div className="w-full flex p-2 bg-[#303033] h-16">
        <Image src={selectedUser?.profileImage + ""} width={45} height={45} className="rounded-full ml-2" alt='' />
        <div className=" ml-2">
          <p className="font-bold">{selectedUser?.userName + ""}</p>
          <p>online</p>
        </div>
      </div>
      {selectEmoji &&
        <div className="fixed mt-1">
          <Picker data={data} onEmojiSelect={({ native }: { native: string }) => setMessage(message + native)} />
        </div>
      }

      <div className="flex h-[72vh] messageBar overflow-auto bg-yellow-100 flex-col" style={{ backgroundImage: "url('/images/chatBgImage.avif')" }} >
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex w-[75%] p-3 max-w-xs ${item.from === user?._id ? 'justify-start' : 'justify-end ml-auto'}`}>

            {item.from === user?._id ? (
              <>
                <div className="flex-shrink-0 h-8 w-8 m-1 rounded-full bg-gray-300">
                  <img src={"personDetails.profileImage"} alt="Profile" className="rounded-full" />
                </div>
                <div>
                  <div className="bg-gray-300 text-black flex p-3 ml-1 rounded-r-lg rounded-bl-lg">
                    <p className="text-sm mr-3">{"item.message"}</p>
                    {item.seen ? (
                      <div className="w-4 mt-1 ml-auto">
                        <img src="/images/double-check.png" alt="Seen" />
                      </div>
                    ) : (
                      <div className="w-4 ml-auto">
                        <img src="/images/check.png" alt="Delivered" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    {getTimeDifference(new Date() + "") ? getTimeDifference(new Date() + "") + " ago" : "Now"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="bg-indigo-300 text-black flex p-3 rounded-l-lg rounded-br-lg">
                    <p className="text-sm mr-3">{"item.message"}</p>
                    {item.seen ? (
                      <div className="w-4 mt-1 ml-auto">
                        <img src="/images/double-check.png" alt="Seen" />
                      </div>
                    ) : (
                      <div className="w-4 ml-auto">
                        <img src="/images/check.png" alt="Delivered" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    {getTimeDifference(new Date() + "") ? getTimeDifference(new Date() + "") + " ago" : "Now"}
                  </span>
                </div>
                <div className="flex-shrink-0 h-8 w-8 m-1 rounded-full bg-gray-300">
                  <img src={"user?.profileImage"} className="rounded-full" alt="User" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="w-[90%] p-1 text-black flex">
        <AttachFileIcon className="m-1" />
        <div onClick={(e) => setSelectEmoji(!selectEmoji)} >
          <MoodOutlinedIcon className="mt-1" /> </div>
        <FormControl fullWidth sx={{ m: 0 }} className="ml-2" variant="standard">
          <Input id="standard-adornment-amount" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter Your Message" />
        </FormControl>
        <SendIcon className="ml-2" onClick={() => sendMessage()} />
      </div>

    </main>
  );
}

export default page;
