
import { UserModel } from '@/models/users';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        return NextResponse.json({ data: await UserModel.findById(params.userId), message: "success" });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
