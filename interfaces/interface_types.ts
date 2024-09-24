import { Document } from 'mongoose'
import { Dispatch, SetStateAction } from 'react'

export type chatSideBarType = {
    profileImage: string,
    userName: string,
    lastMessage: string
}

export interface IUser extends Document {
    Email: string,
    Password: string,
    userName: string,
    Phone: number,
    profileImage: string,
    IsAdmin: boolean,
    IsBlocked: boolean
    lastMessage?: string
}

export interface IChat extends Document {
    from: string,
    to: string,
    message: string,
    type: string,
    seen: boolean
}

export interface LoginData {
    Email: string,
    Password: string
}

export interface registerData {
    userName: string,
    Email: string,
    Password: string,
    Phone: number
}

export interface SideUsersProps {
    setSelectedUser: Dispatch<SetStateAction<IUser | null>>
    setMessages: Dispatch<SetStateAction<IChat[]>>
}
