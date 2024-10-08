import { UserModel } from "@/models/users";


export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const user = await UserModel.findById(body.userId)
        if (user) {
            if (user.blockedUsers?.includes(body.selectedId)) {
                user.blockedUsers = user.blockedUsers?.filter((i: string) => i !== body.selectedId)
            } else {
                user.blockedUsers.push(body.selectedId)
            }
            await user.save()
        }
        return new Response("success", { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: JSON.parse(JSON.stringify(error)).message ?? "Error occurred" }), { status: 500 });
    }
}