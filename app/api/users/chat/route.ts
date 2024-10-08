import { ChatModel } from "@/models/chat";

const getChat = async (from: string, to: string) => {
    return await ChatModel.find({
      $and: [
        { $or: [{ from, to }, { from: to, to: from }] },
        { archived: { $nin: [from] } }
      ]
    });
  };
  
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        const data = JSON.stringify(await getChat(from + "", to + ""))
        return new Response(data, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const from = url.searchParams.get('userId') + "";
        const to = url.searchParams.get('selectedId') + "";
        const data = await ChatModel.find({ $or: [{ from, to }, { from: to, to: from }] });
        for (const doc of data) {
            if (doc.archived.includes(to)) {
                await ChatModel.findByIdAndDelete(doc._id)
            } else {
                doc.archived.push(from)
                await doc.save()
            }
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        console.log(error);
        return new Response(JSON.stringify({ message: error.message ?? "Error occurred" }), { status: 500 });
    }
}

