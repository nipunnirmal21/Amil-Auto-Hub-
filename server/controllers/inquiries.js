import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { parseInquiry } from '../middleware/validateInquiry.js';
export async function createInquiry(req,res){let payload;try{payload=parseInquiry(req.body)}catch(e){return res.status(400).json({message:e.message})}if(mongoose.connection.readyState!==1)return res.status(503).json({message:'Online inquiries are temporarily unavailable. Please contact us on Facebook.'});await Inquiry.create(payload);res.status(201).json({message:'Your inquiry has been received.'})}
