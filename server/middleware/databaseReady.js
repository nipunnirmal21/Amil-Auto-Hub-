import mongoose from 'mongoose';

export default function databaseReady(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'The database is temporarily unavailable.' });
  }
  return next();
}
