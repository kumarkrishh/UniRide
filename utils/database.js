import mongoose from 'mongoose';

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }

  const options = {
    dbName: "share_prompt",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true, // Ensures that the connection is kept active
    keepAliveInitialDelay: 300000 // Start sending keepAlive packets after 300000ms of inactivity
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};
