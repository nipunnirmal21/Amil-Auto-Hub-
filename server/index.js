import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const port = Number(process.env.PORT) || 4000;

createApp().listen(port, '127.0.0.1', () => {
  console.log(`Amil Auto Hub API listening on http://127.0.0.1:${port}`);
});

connectDatabase()
  .then(() => console.log('MongoDB connected.'))
  .catch(error => {
    console.error(`MongoDB unavailable: ${error.message}`);
    console.error('The health endpoint remains available; database-backed endpoints return 503 until MongoDB is configured.');
  });
