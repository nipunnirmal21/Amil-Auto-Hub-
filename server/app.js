import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import api from './routes/api.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  const allowed = (process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173')
    .split(',')
    .map(value => value.trim());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) return callback(null, true);
      const error = new Error('Origin not allowed.');
      error.status = 403;
      return callback(error);
    },
  }));
  app.use(express.json({ limit: '64kb' }));
  app.use('/api/uploads', express.static(path.resolve('server/uploads'), { fallthrough: false, maxAge: '1d' }));
  app.use('/api', api);
  app.use((req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    let status = error.status || 500;
    let message = status >= 500 ? 'Unable to process the request. Please try again later.' : error.message;
    if (error instanceof multer.MulterError) {
      status = 400;
      message = error.code === 'LIMIT_FILE_SIZE' ? 'Images must be 5 MB or smaller.' : 'The uploaded files could not be accepted.';
    }
    if (error?.code === 11000) {
      status = 409;
      message = 'A record with that email or slug already exists.';
    }
    if (error?.name === 'ValidationError') {
      status = 400;
      message = Object.values(error.errors).map(item => item.message).join(' ');
    }
    return res.status(status).json({ message });
  });
  return app;
}
