const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatterhub');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB nuk është aktiv — vazhdon pa të:', error.message);
  }
};

module.exports = connectMongo;
