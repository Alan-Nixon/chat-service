import { UserModel } from '@/models/users';
import { compare } from 'bcrypt'

const sendResponse = (data: any, status: number) => {
    return new Response(JSON.stringify(data), { status })
}

export async function GET(request: Request) {
    try {
        return sendResponse("hey", 200)
    } catch (error) {

    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await UserModel.findOne({ Email: body.Email });
        if (user) {
            if (!user.IsBlocked) {
                if (await compare(body.Password, user.Password)) {
                    return sendResponse({ status: true, message: "success", data: user }, 200)
                } else {
                    return sendResponse({ status: false, message: "Password doesn't match" }, 200)
                }
            } else {
                return sendResponse({ status: false, message: "User Is Blocked" }, 200)
            }
        } else {
            return sendResponse({ status: false, message: "Cannot find your account try register" }, 200)
        }
    } catch (error: any) {
        console.log(error)
        return sendResponse(error.message ?? "Internal server Error", 500)
    }
}