// models/location.js
import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';

const locationSchema = new Schema({
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

const Location = models.Location || model('Location', locationSchema);

export default Location;
