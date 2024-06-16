// models/location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startAddress: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destinationAddress: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  date: String,  
  time: String
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
