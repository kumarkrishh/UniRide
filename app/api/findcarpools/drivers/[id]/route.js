import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
    console.log("reached new route");
    try {
        await connectToDB();

        // Get the current date and time in the user's local timezone
        const currentDateTime = new Date();
        const currentDate = currentDateTime.toLocaleDateString('en-CA'); // Get date in YYYY-MM-DD format
        const currentTime = currentDateTime.toLocaleTimeString('en-GB', { hour12: false }); // Get time in HH:MM:SS format

        const trips = await Location.find({
            rideType: 'driver',
            $or: [
                { date: { $gt: currentDate } }, // Dates after today
                { date: currentDate, time: { $gte: currentTime } } // If today, check for time greater or equal
            ]
        }).populate('userId');

        return new Response(JSON.stringify(trips), { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
