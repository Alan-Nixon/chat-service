import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUser, singleChatTypeProp } from "@/interfaces/interface_types";
import { useSocket } from "../page";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { clearChatMessages } from "../(functions)/userFunction";

function ChatHeader({
  selectedUser,
  messages,
  setMessages,
}: singleChatTypeProp) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState("");
  const { data: user } = useSession();
  const socket = useSocket();

  useEffect(() => {
    if (socket && selectedUser && user) {
      socket.emit("isOnline", {
        selectedUser: selectedUser?._id + "",
        userId: user?._id + "",
      });

      socket.on("isOnline", ({ lastSeen, lastUserId }) => {
        if (lastUserId === selectedUser._id) setIsOnline(lastSeen);
      });
    }
  }, [socket, selectedUser, user]);

  const clearChat = () => {
    clearChatMessages(user?._id + "", selectedUser?._id + "");
    setMessages([]);
  };

  return (
    <header className="bg-primary text-primary-foreground border-t-2 p-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="ml-2">
          <AvatarImage
            src={selectedUser?.profileImage}
            alt={selectedUser?.userName}
          />
          <AvatarFallback>
            {selectedUser?.userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{selectedUser?.userName}</h2>
          <p className="text-sm">{isOnline}</p>
        </div>
      </div>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Open settings menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => clearChat()}>
            Clear Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>Block User</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default ChatHeader;
