import { Document } from 'mongoose'

export type chatSideBarType = {
    profileImage: string,
    userName: string,
    lastMessage: string
}

export interface IUser extends Document {
    
}