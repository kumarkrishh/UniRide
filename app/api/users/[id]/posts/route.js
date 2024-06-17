//import Prompt from "@models/prompt";
import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const GET = async (request, {params}) => {
    try {
        await connectToDB()

        
        const trips = await Location.find({
            creator: params.id
        }).populate('userId')
        console.log("hi");
        console.log(trips);
        console.log("bye");

        return new Response(JSON.stringify(trips), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 