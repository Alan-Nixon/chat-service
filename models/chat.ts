import { IChat } from '@/interfaces/interface_types'
import { Schema, model, models } from 'mongoose'

const enumData: string[] = ["text", "image", "document", "video", "voice"]

const chatSchema = new Schema<IChat>({

    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: enumData, required: true, default: "text" },
    seen: { type: Boolean, required: true, default: false }

}, { timestamps: true })

export const ChatModel =models.chats || model("chats",chatSchema)