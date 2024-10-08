/* eslint-disable */
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IChat,
  payloadIds,
  singleChatTypeProp,
} from "@/interfaces/interface_types";
import dynamic from "next/dynamic";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSocket } from "../hooks/useSocket";
import ChatHeader from "./ChatHeader";
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

export default function MainChat({ Data }: { Data: singleChatTypeProp }) {
  const { selectedUser, messages, setMessages, navBarRef } = Data;
  const [inputMessage, setInputMessage] = useState("");
  const [selectEmoji, setSelectEmoji] = useState(false);
  const { data: user } = useSession();
  const [isBlocked, setIsBlocked] = useState<boolean>(
    !selectedUser?.blockedUsers.includes(user?._id + "")
  );

  const emojiRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);;
  const socket = useSocket();

  useEffect(() => {
    if (socket && selectedUser && user) {
      const handleMessage = (msg: IChat) => {
        const me = msg.from === user._id && msg.to === selectedUser._id;
        const him = msg.from === selectedUser._id && msg.to === user._id;
        if (me || him) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      const handleBlock = (payload: payloadIds) => {
        const cond =
          payload.userId === selectedUser._id &&
          payload.selectedId === user._id;
        if (cond) {
          setIsBlocked((prev) => !prev);
        }
      };

      socket.on("input_message_send", handleMessage);
      socket.on("block_user", handleBlock);

      return () => {
        socket.off("input_message_send", handleMessage);
        socket.off("block_user", handleBlock);
      };
    }
  }, [socket, selectedUser, user]);

  useEffect(() => {
    scrollBottom();
  }, [messages, selectedUser]);

  const handleEmojiSelect = useCallback(({ native }: { native: string }) => {
    setInputMessage((prev) => prev + native);
    setSelectEmoji(false);
  }, []);

  const scrollBottom = () => {
    if (scrollRef.current && navBarRef.current && messages.length > 6) {
      const args = (entries: any) => {
        if (entries[0].isIntersecting) {
          navBarRef.current.scrollIntoView({ behavior: "smooth" });
          observer.disconnect();
        }
      };

      const observer = new IntersectionObserver(args, { threshold: 1.0 });
      observer.observe(scrollRef.current);

      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" && user) {
      const mess: IChat = {
        from: user._id,
        to: selectedUser?._id + "",
        message: inputMessage,
        type: "text",
        seen: false,
        archived: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IChat;
      socket?.emit("input_message_send", mess);
      setInputMessage("");
      scrollBottom();
    }
  };

  const setTyping = () => {
    socket?.emit("started_typing", {
      to: selectedUser?._id,
      from: user?._id,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
      />

      <ScrollArea className="p-4 h-[calc(100vh-190px)]">
        <div>
          {[...messages].map((message, index) => (
            <div
              ref={index === messages.length - 1 ? scrollRef : null}
              key={index}
              className={`mb-4 ${
                message.from === user?._id ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.from === user?._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectEmoji && (
        <div className="z-10 fixed mb-24" id="EMOJI_CLICKED_AREA">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}

      {isBlocked ? (
        <>
          <div className="p-2 mt-2 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2"
            >
              <div className="relative" ref={emojiRef}>
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setSelectEmoji((prev) => !prev)}
                  className="mr-2"
                >
                  <Smile className="h-6 w-6" />
                </Button>
              </div>

              <Input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  setTyping();
                }}
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
        </>
      ) : (
        <>
          <div className="p-4 text-red-600 mx-auto font-bold border-t">
            You have been blocked by {selectedUser?.userName}
          </div>
        </>
      )}
    </div>
  );
}
