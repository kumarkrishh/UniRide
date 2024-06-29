import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (request, {params}) => {
    console.log("reached new route");
    try {
        await connectToDB()
        
        const trips = await Location.find({
            'startAddress.address': params.start,
            'destinationAddress.address' : params.end,
            date: params.date,
            time: params.time,
            userId: { $ne: params.id }
        }).populate('userId')

        return new Response(JSON.stringify(trips), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 
