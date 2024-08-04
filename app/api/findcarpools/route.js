import Location from "@models/location";
import { connectToDB } from "@utils/database";

const MILE_TO_LATLNG = 1 / 69;


const getTimeWindow = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeWindowStart = new Date();
    const timeWindowEnd = new Date();
    timeWindowStart.setHours(hours, minutes - 30, 0, 0);
    timeWindowEnd.setHours(hours, minutes + 30, 0, 0);
    return {
      start: timeWindowStart.toTimeString().slice(0, 5),
      end: timeWindowEnd.toTimeString().slice(0, 5)
    };
  };


export const POST = async (request) => {
    console.log("reached new route");
    try {
        await connectToDB();
        
        const { location, destination, date, time, userId, coordinates, destinationCoordinates } = await request.json();
        const { start, end } = getTimeWindow(time);

        const trips = await Location.find({
            'startAddress.coordinates.lat': { $gte: coordinates.lat - MILE_TO_LATLNG * 3, $lte: coordinates.lat + MILE_TO_LATLNG * 3 },
            'startAddress.coordinates.lng': { $gte: coordinates.lng - MILE_TO_LATLNG * 3, $lte: coordinates.lng + MILE_TO_LATLNG * 3 },
            'destinationAddress.coordinates.lat': { $gte: destinationCoordinates.lat - MILE_TO_LATLNG * 3, $lte: destinationCoordinates.lat + MILE_TO_LATLNG * 3 },
            'destinationAddress.coordinates.lng': { $gte: destinationCoordinates.lng - MILE_TO_LATLNG * 3, $lte: destinationCoordinates.lng + MILE_TO_LATLNG * 3 },
            date: date,
            time: { $gte: start, $lte: end },
            userId: { $ne: userId }
            
        }).populate('userId');
        console.log(trips);

        return new Response(JSON.stringify(trips), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
