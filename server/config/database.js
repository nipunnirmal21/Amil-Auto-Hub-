import mongoose from 'mongoose';
export async function connectDatabase(){if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI in server/.env before starting the backend.');await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});}
