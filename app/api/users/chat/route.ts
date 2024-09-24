import { ChatModel } from "@/models/chat";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        const data = JSON.stringify(await ChatModel.find({ $or: [{ from, to }, { from: to, to: from }] }))
        return new Response(data, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
    }
}

