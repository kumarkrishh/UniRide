import { connectToDB } from "@utils/database";
import Notification from "@models/notification";

export const GET = async (req, { params }) => {
  const { userID } = params.id;

  try {
    await connectToDB();

    const notifications = await Notification.find({ recipientId: params.id });
    console.log(notifications);
    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error', error }), { status: 500 });
  }
};
