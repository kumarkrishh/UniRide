import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    console.log("reached new route");
    try {
        await connectToDB();

        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        const trips = await Location.find({
            rideType: 'driver',
            date: { $gt: currentDate } // Filtering for dates after today
        }).populate('userId');

        return new Response(JSON.stringify(trips), { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
