import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    console.log("reached new route");
    try {
        await connectToDB();

        const trips = await Location.find({
            rideType: 'driver'
        }).populate('userId');
        

        return new Response(JSON.stringify(trips), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
