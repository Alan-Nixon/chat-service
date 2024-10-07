"use client";

import { useState } from "react";
import { Menu, MessageSquare, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { logout } from "../(functions)/userFunction";
import { useSocket } from "../page";

type navBarInterface = {
  onToggleSidebar: () => void;
  navBarRef: any;
};

export default function Navbar(props: navBarInterface) {
    
  const { onToggleSidebar, navBarRef } = props;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: user } = useSession();
  const socket = useSocket();

  return (
    <nav
      ref={navBarRef}
      className="bg-primary text-primary-foreground p-2 flex items-center justify-between"
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-5">AV Chats</h1>
      </div>
      <div className="flex items-center space-x-2">
        {isSearchOpen ? (
          <Input
            type="search"
            placeholder="Search..."
            className="w-full max-w-sm"
            onBlur={() => setIsSearchOpen(false)}
            style={{ color: "black" }}
          />
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout(user?._id + "");
                socket?.emit("log_online", {
                  userId: user?._id + "",
                  lastSeen: new Date(),
                });
              }}
              size="icon"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col items-center justify-center h-full">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.profileImage} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-2">{user?.userName}</h2>
                  <p className="text-muted-foreground mb-4">{user?.Email}</p>
                  <Button>Edit Profile</Button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </nav>
  );
}
