import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        await Location.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};