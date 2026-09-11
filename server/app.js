import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import api from './routes/api.js';
export function createApp(){const app=express();app.disable('x-powered-by');app.use(helmet());const allowed=(process.env.CLIENT_ORIGIN||'http://127.0.0.1:5173,http://localhost:5173').split(',').map(s=>s.trim());app.use(cors({origin(origin,callback){if(!origin||allowed.includes(origin))return callback(null,true);const error=new Error('Origin not allowed.');error.status=403;callback(error)}}));app.use(express.json({limit:'16kb'}));app.use('/api',api);app.use((req,res)=>res.status(404).json({message:'Endpoint not found.'}));app.use((err,req,res,next)=>{const status=err.status||500;res.status(status).json({message:status===413?'Inquiry is too large.':status===400?'Invalid request body.':status===403?'Origin not allowed.':'Unable to process the request. Please try again later.'})});return app}
