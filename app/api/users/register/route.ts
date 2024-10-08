import { UserModel } from '@/models/users';
import { hash } from 'bcrypt'

const sendResponse = (data: object, status: number) => {
    return new Response(JSON.stringify(data), { status })
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = await UserModel.findOne({ Email: body.Email })
        if (data) {
            return sendResponse({ message: "Account Already exists, try login", status: false }, 200)
        } else {
            body.Password = await hash(body.Password, 10);
            body.IsAdmin = false
            body.IsBlocked = false
            body.profileImage = "https://res.cloudinary.com/dyh7c1wtm/image/upload/v1727013356/profile/chatService/user_jkk9gy.jpg"
            body.lastSeen = new Date() + "";
            const data = await UserModel.insertMany(body);
            return sendResponse({ message: "gtcha", status: true, data: data[0] }, 200)
        }
    } catch (error) {
        const errorMessage =  JSON.parse(JSON.stringify(error)).message
        return sendResponse({ message: errorMessage ?? "Internal Error occured", status: true }, 500)
    }
}