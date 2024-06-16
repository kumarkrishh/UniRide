// pages/api/location/[id].js
import Location from "@models/location";
import { connectToDB } from "@utils/database";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query; // Assuming you're passing the ID as a URL parameter

    await connectToDB();

    switch (method) {
        case 'GET':
            return getLocation(req, res, id);
        case 'POST':
            return createLocation(req, res);
        case 'PATCH':
            return updateLocation(req, res, id);
        case 'DELETE':
            return deleteLocation(req, res, id);
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}

async function getLocation(req, res, id) {
    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        return res.status(200).json(location);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function createLocation(req, res) {
    try {
        const { address, lat, lng, userId } = req.body;
        const newLocation = new Location({ address, coordinates: { lat, lng }, userId });
        await newLocation.save();
        return res.status(201).json(newLocation);
    } catch (error) {
        return res.status(500).json({ message: "Error creating location" });
    }
}

async function updateLocation(req, res, id) {
    try {
        const { address, lat, lng } = req.body;
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        location.address = address || location.address;
        location.coordinates.lat = lat || location.coordinates.lat;
        location.coordinates.lng = lng || location.coordinates.lng;
        await location.save();
        return res.status(200).json(location);
    } catch (error) {
        return res.status(500).json({ message: "Error updating location" });
    }
}

async function deleteLocation(req, res, id) {
    try {
        await Location.findByIdAndDelete(id);
        return res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting location" });
    }
}
