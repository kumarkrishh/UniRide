import { connectToDB } from "@utils/database";
import Notification from "@models/notification";

export const POST = async (req, {params}) => {
  try {
    await connectToDB();

   
    const notification = await Notification.findByIdAndDelete(params.notifID);

    if (!notification) {
      return new Response(JSON.stringify({ message: 'Notification not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(notification), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error', error }), { status: 500 });
  }
};
