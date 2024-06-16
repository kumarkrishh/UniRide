import Location from "@models/location"; // Assuming the model name is Location
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    // Assume the request body includes an address, coordinates (lat, lng), and the userId
    const { address, lat, lng, userId } = await request.json();

    try {
        await connectToDB();

        // Creating a new location entry with the received data
        const newLocation = new Location({
            address,
            coordinates: {
                lat,
                lng
            },
            userId
        });

        await newLocation.save(); // Save the new location to the database

        // Return a response with the newly created location
        return new Response(JSON.stringify(newLocation), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 201
        });
    } catch (error) {
        console.error('Failed to create a new location:', error);
        return new Response(JSON.stringify({ message: "Failed to create a new location" }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
};
