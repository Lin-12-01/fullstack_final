const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('ВСТАВЬ')) {
    throw new Error('MONGODB_URI is not configured. Update backend/.env');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
