const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongo() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('MongoDB URI not provided. Skipping MongoDB connection.');
      return;
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}

module.exports = connectMongo;