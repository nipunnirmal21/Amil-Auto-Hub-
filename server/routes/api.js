import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { listProducts,getProduct } from '../controllers/products.js';
import { createInquiry } from '../controllers/inquiries.js';
const router=Router();
router.get('/products',listProducts);
router.get('/products/:id',getProduct);
router.post('/inquiries',rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-7',legacyHeaders:false,message:{message:'Too many inquiries. Please try again in 15 minutes.'}}),createInquiry);
export default router;
