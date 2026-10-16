import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('Set MONGODB_URI or MONGO_URI in server/.env before starting the backend.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
}
