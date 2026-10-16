import mongoose from 'mongoose';
import Product from '../models/Product.js';

function ensureDatabase(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ message: 'The catalogue is temporarily unavailable.' });
  return false;
}

const populateProduct = query => query
  .populate('category', 'name slug icon active')
  .populate('subcategory', 'name slug parentCategory active');

export async function listProducts(req, res) {
  if (!ensureDatabase(res)) return;
  const products = await populateProduct(Product.find({ active: true }))
    .sort({ featured: -1, createdAt: -1 })
    .limit(200)
    .lean();
  res.json({ products });
}

export async function getProduct(req, res) {
  if (!ensureDatabase(res)) return;
  const value = req.params.slug;
  const filter = mongoose.isObjectIdOrHexString(value) ? { _id: value, active: true } : { slug: value, active: true };
  const product = await populateProduct(Product.findOne(filter)).lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product });
}
