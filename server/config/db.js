const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] disconnected — API may return errors until reconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] reconnected');
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || !String(uri).trim()) {
    throw new Error(
      'MONGO_URI is not set. Copy server/.env from .env.example and set a connection string.'
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw new Error(
      'Cannot connect to local MongoDB. Start the MongoDB service (mongod) on port 27017 and check MONGO_URI in server/.env.'
    );
  }
};

module.exports = connectDB;
