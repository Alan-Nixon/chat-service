import { Document } from 'mongoose'

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