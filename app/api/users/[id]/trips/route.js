
import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (request, {params}) => {
    try {
        await connectToDB()

        
        const trips = await Location.find({
            userId: params.id
        }).populate('userId')
        console.log(trips);

        return new Response(JSON.stringify(trips), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 