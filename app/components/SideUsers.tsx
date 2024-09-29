import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IChat, IUser, SideUsersProps } from "@/interfaces/interface_types"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getChat, getUsers } from "../(functions)/userFunction";


export default function Sidebar({ setSelectedUser, setMessages }: SideUsersProps) {

  const [sideBarData, setSideBarData] = useState<IUser[]>([]);
  const { data: user } = useSession()

  useEffect(() => {
    getUsers().then(({ data }: { data: IUser[] }) => {
      setSideBarData(data.filter(item => item._id !== user?._id))
    });
  }, [])

  const selectUser = (userData: IUser) => {
    getChat(user?._id + "", userData._id + "").then((data) => {
      //  remove it 
      const chats: IChat[] = new Array(10).fill({
        from: "string",
        to: "string",
        message: userData.userName === "midhun chettan" ? "hi alan" : "good",
        type: "text",
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log(data);
      setSelectedUser(userData);
      setMessages(chats)
    })
  }

  return (
    <aside className="w-64 bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        {sideBarData.map((user) => (
          <div
            key={user._id + "" + Math.random()}
            className="flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer"
            onClick={() => selectUser(user)}
          >
            <Avatar>
              <AvatarImage src={user.profileImage} alt={user.userName} />
              <AvatarFallback>{user.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.userName}</p>
              <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  )
}
