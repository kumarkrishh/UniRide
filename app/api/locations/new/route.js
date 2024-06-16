// app/api/locations/new/route.js
import Location from "@models/location";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { startAddress, destinationAddress, userId } = await request.json();

    try {
        await connectToDB();

        // Creating a new location entry with the received data
        const newLocation = new Location({
            userId,
            startAddress: {
                address: startAddress.address,
                coordinates: {
                    lat: startAddress.coordinates.lat,
                    lng: startAddress.coordinates.lng
                }
            },
            destinationAddress: {
                address: destinationAddress.address,
                coordinates: {
                    lat: destinationAddress.coordinates.lat,
                    lng: destinationAddress.coordinates.lng
                }
            }
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
