import Location from "@models/location";
import { connectToDB } from "@utils/database";

const MILE_TO_LATLNG = 1 / 69;

export const POST = async (request) => {
    console.log("reached new route");
    try {
        await connectToDB();
        
        const { location, destination, date, time, userId, coordinates, destinationCoordinates } = await request.json();
        
        const timeWindowStart = new Date(`${date}T${time}`);
        const timeWindowEnd = new Date(timeWindowStart);
        timeWindowStart.setMinutes(timeWindowStart.getMinutes() - 30);
        timeWindowEnd.setMinutes(timeWindowEnd.getMinutes() + 30);
        
        const trips = await Location.find({
            'startAddress.coordinates.lat': { $gte: coordinates.lat - MILE_TO_LATLNG * 3, $lte: coordinates.lat + MILE_TO_LATLNG * 3 },
            'startAddress.coordinates.lng': { $gte: coordinates.lng - MILE_TO_LATLNG * 3, $lte: coordinates.lng + MILE_TO_LATLNG * 3 },
            'destinationAddress.coordinates.lat': { $gte: destinationCoordinates.lat - MILE_TO_LATLNG * 3, $lte: destinationCoordinates.lat + MILE_TO_LATLNG * 3 },
            'destinationAddress.coordinates.lng': { $gte: destinationCoordinates.lng - MILE_TO_LATLNG * 3, $lte: destinationCoordinates.lng + MILE_TO_LATLNG * 3 },
            date: date,
            time: time,
            userId: { $ne: userId }
            
        }).populate('userId');
        console.log(coordinates.lat, coordinates.lng);

        return new Response(JSON.stringify(trips), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
