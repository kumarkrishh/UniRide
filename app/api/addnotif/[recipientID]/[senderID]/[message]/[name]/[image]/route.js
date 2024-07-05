import { connectToDB } from "@utils/database";
import User from "@models/user";
import Notification from "@models/notification";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    // Check if a notification already exists with the same values
    const existingNotif = await Notification.findOne({
      recipientId: params.recipientID,
      senderId: params.senderID,
      message: params.message,
      chatwithname: params.name,
      chatwithimage: params.image,
    });

    if (existingNotif) {
      return new Response("Notification already exists", { status: 200 });
    }

    // Create a new notification if it doesn't already exist
    const notif = new Notification({
      recipientId: params.recipientID,
      senderId: params.senderID,
      message: params.message,
      chatwithname: params.name,
      chatwithimage: params.image,
    });

    await notif.save();
    return new Response("Added", { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response("Failed to add notification", { status: 500 });
  }
};
