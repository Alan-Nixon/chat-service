import { UserModel } from "@/models/users";


export async function GET() {
    try {
        const data = JSON.stringify({ data: await UserModel.find() })
        return new Response(data, { status: 200 })
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message ?? "Internal Error" }), { status: 500 })
    }
}