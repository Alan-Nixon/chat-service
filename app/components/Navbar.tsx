"use client";

import { useRef, useState } from "react";
import { Menu, MessageSquare, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { logout, saveProfilImage } from "../(functions)/userFunction";
import { navBarInterface } from "@/interfaces/interface_types";
import { useSocket } from "../page";

export default function Navbar(props: navBarInterface) {
  const { onToggleSidebar, navBarRef } = props;
  const { data: user } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileImg, setProfileImg] = useState(user?.profileImage + "");
  const socket = useSocket();
  const profileImageref = useRef<HTMLInputElement | null>(null);

  const openImage = () => {
    if (profileImageref?.current) {
      profileImageref?.current.click();
    }
  };
  const saveImage = () => {
    if (selectedImage) {
      saveProfilImage(selectedImage, user?._id + "");
      setSelectedImage(null);
    }
  };

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
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target?.files;
          if (file) {
            setSelectedImage(file[0]);
            setProfileImg(URL.createObjectURL(file[0]));
          }
        }}
        ref={profileImageref}
        accept="image/*"
      />
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
                    <AvatarImage src={user?.profileImage} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col items-center justify-center h-full">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profileImg} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-2">{user?.userName}</h2>
                  <p className="text-muted-foreground mb-4">{user?.Email}</p>
                  {selectedImage ? (
                    <Button onClick={saveImage}>Save Profile</Button>
                  ) : (
                    <Button onClick={openImage}>Edit Profile</Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </nav>
  );
}
