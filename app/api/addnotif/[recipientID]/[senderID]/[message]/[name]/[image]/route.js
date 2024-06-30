import { connectToDB } from "@utils/database";
import User from "@models/user";
import Notification from "@models/notification";

export const POST = async (req, {params}) => {

    try {
        await connectToDB();

        
        const notif = new Notification({
            recipientId: params.recipientID,
            senderId: params.senderID,
            message: params.message,
            chatwithname: params.name,
            chatwithimage: params.image,
        });

        await notif.save();
     return new Response("added", { status: 200 });
        

    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
};
