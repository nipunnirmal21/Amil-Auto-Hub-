import mongoose from 'mongoose';
import Product from '../models/Product.js';
export async function listProducts(req,res){if(mongoose.connection.readyState!==1)return res.status(503).json({message:'The catalogue is temporarily unavailable.'});const products=await Product.find().sort({featured:-1,createdAt:-1}).limit(100).lean();res.json({products})}
export async function getProduct(req,res){if(!mongoose.isObjectIdOrHexString(req.params.id))return res.status(400).json({message:'Invalid product ID.'});if(mongoose.connection.readyState!==1)return res.status(503).json({message:'The catalogue is temporarily unavailable.'});const product=await Product.findById(req.params.id).lean();if(!product)return res.status(404).json({message:'Product not found.'});res.json({product})}
