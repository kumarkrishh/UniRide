// models/location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    address: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.models.Location || mongoose.model('Location', locationSchema);
