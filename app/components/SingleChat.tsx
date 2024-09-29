"use client"
import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { singleChatTypeProp } from '@/interfaces/interface_types'
import dynamic from 'next/dynamic'
import data from '@emoji-mart/data';
import { Smile } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useSocket } from '../page'
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

export default function MainChat({ selectedUser, messages, setMessages }: singleChatTypeProp) {
  const [inputMessage, setInputMessage] = useState('')
  const [selectEmoji, setSelectEmoji] = useState(false);
  const [isOnline, setIsOnline] = useState("")

  const { data: user } = useSession();
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const socket = useSocket()


  useEffect(() => {
    if (socket && selectedUser && user) {
      socket.emit("isOnline", { selectedUser: selectedUser?._id + "", userId: user?._id + "" });
      socket.on("isOnline", ({ lastSeen, lastUserId }) => {
        if (lastUserId === selectedUser._id)
          setIsOnline(lastSeen)
      })
    }
  }, [socket, selectedUser, user])

  const handleEmojiSelect = useCallback(({ native }: { native: string }) => {
    setInputMessage((prev) => prev + native);
    setSelectEmoji(false);
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && user) {
      setInputMessage('');
    }
  }


  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-primary text-primary-foreground border-t-2 p-2 flex items-center space-x-4">
        <Avatar className='ml-2' >
          <AvatarImage src={selectedUser.profileImage} alt={selectedUser.userName} />
          <AvatarFallback>{selectedUser.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.userName}</h2>
          <p>{isOnline}</p>
        </div>
      </header>

      <ScrollArea className="p-4 h-[calc(100vh-190px)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.from === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${message.from === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'}`}
            >
              {message.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </ScrollArea>
      {selectEmoji && (
        <div className="z-10 fixed mb-24" id='EMOJI_CLICKED_AREA' >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
      )}

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <div className="relative" ref={emojiRef}>

            <Button
              // variant="ghost"
              type='button'
              size="icon"
              onClick={() => setSelectEmoji(prev => !prev)}
              className="mr-2"
            >
              <Smile className="h-6 w-6" />
            </Button>
          </div>

          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow text-black"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <Button>
            <Mic className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
