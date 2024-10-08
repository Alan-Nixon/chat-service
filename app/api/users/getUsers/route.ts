import { UserModel } from "@/models/users";


export async function GET() {
    try {
        const data = JSON.stringify({ data: await UserModel.find() });
        return new Response(data, { status: 200 });
    } catch (error) {
        const errorMessage =  JSON.parse(JSON.stringify(error)).message
        return new Response(JSON.stringify({ message:errorMessage  ?? "Internal Error" }), { status: 500 });
    }
} 