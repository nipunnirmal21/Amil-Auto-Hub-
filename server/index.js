import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
try{await connectDatabase();const port=Number(process.env.PORT)||4000;createApp().listen(port,()=>console.log(`Amil Auto Hub API listening on http://localhost:${port}`))}catch{console.error('Backend could not start. Check MONGODB_URI and database connectivity.');process.exitCode=1}
