import { IUser } from '@/interfaces/interface_types'
import { model, models, Schema } from 'mongoose'

const userSchema = new Schema<IUser>({

    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    userName: { type: String, required: true },
    Phone: { type: Number, required: true, unique: true },
    profileImage: { type: String, required: true },
    IsAdmin: { type: Boolean, required: true, default: false },
    IsBlocked: { type: Boolean, required: true, default: false }

}, { timestamps: true })

export const UserModel = models.users || model("users", userSchema)