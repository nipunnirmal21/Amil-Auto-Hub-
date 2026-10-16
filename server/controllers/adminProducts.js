import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import slugify from '../utils/slugify.js';

const populateProduct = query => query
  .populate('category', 'name slug')
  .populate('subcategory', 'name slug parentCategory');

function parseJson(value, fallback) {
  if (value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function booleanValue(value, fallback = false) {
  if (value === undefined) return fallback;
  return value === true || value === 'true' || value === '1';
}

async function validateCategorySelection(categoryId, subcategoryId) {
  if (!mongoose.isObjectIdOrHexString(categoryId)) {
    const error = new Error('Select a valid main category.');
    error.status = 400;
    throw error;
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('The selected category no longer exists.');
    error.status = 400;
    throw error;
  }
  if (!subcategoryId) return;
  if (!mongoose.isObjectIdOrHexString(subcategoryId)) {
    const error = new Error('Select a valid subcategory.');
    error.status = 400;
    throw error;
  }
  const subcategory = await Subcategory.findOne({ _id: subcategoryId, parentCategory: categoryId });
  if (!subcategory) {
    const error = new Error('The selected subcategory does not belong to this category.');
    error.status = 400;
    throw error;
  }
}

function productValues(req, existing = null) {
  const uploadedMain = req.files?.mainImage?.[0];
  const uploadedGallery = req.files?.images || [];
  const retainedImages = parseJson(req.body.retainedImages, existing?.images || []);
  const specifications = parseJson(req.body.specifications, existing?.specifications || {});
  const features = parseJson(req.body.features, existing?.features || []);
  return {
    name: String(req.body.name || '').trim(),
    slug: slugify(req.body.slug || req.body.name),
    brand: String(req.body.brand || '').trim(),
    price: Number(req.body.price),
    stockQuantity: Number(req.body.stockQuantity),
    category: req.body.category,
    subcategory: req.body.subcategory || null,
    shortDescription: String(req.body.shortDescription || '').trim(),
    description: String(req.body.description || '').trim(),
    mainImage: uploadedMain ? `/api/uploads/products/${uploadedMain.filename}` : existing?.mainImage,
    images: [
      ...(Array.isArray(retainedImages) ? retainedImages : []),
      ...uploadedGallery.map(file => `/api/uploads/products/${file.filename}`),
    ].slice(0, 6),
    sku: String(req.body.sku || '').trim(),
    vehicleCompatibility: String(req.body.vehicleCompatibility || '').trim(),
    specifications: specifications && typeof specifications === 'object' ? specifications : {},
    features: Array.isArray(features) ? features.filter(Boolean).slice(0, 20) : [],
    warranty: String(req.body.warranty || '').trim(),
    featured: booleanValue(req.body.featured, existing?.featured),
    active: booleanValue(req.body.active, existing?.active ?? true),
  };
}

function validateProductValues(values) {
  if (!values.name) return 'Product name is required.';
  if (!values.slug) return 'A valid product slug is required.';
  if (!Number.isFinite(values.price) || values.price < 0) return 'Price must be a non-negative number.';
  if (!Number.isInteger(values.stockQuantity) || values.stockQuantity < 0) return 'Stock quantity must be a non-negative whole number.';
  if (!values.mainImage) return 'A main product image is required.';
  return null;
}

export async function listAdminProducts(req, res) {
  const filter = {};
  if (req.query.category && mongoose.isObjectIdOrHexString(req.query.category)) filter.category = req.query.category;
  if (req.query.active === 'true' || req.query.active === 'false') filter.active = req.query.active === 'true';
  if (req.query.stockStatus) filter.stockStatus = req.query.stockStatus;
  if (req.query.search) filter.name = { $regex: String(req.query.search).slice(0, 100), $options: 'i' };
  const products = await populateProduct(Product.find(filter).sort({ updatedAt: -1 }).limit(500)).lean();
  res.json({ products });
}

export async function getAdminProduct(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const product = await populateProduct(Product.findById(req.params.id)).lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product });
}

export async function createProduct(req, res) {
  const values = productValues(req);
  const validationError = validateProductValues(values);
  if (validationError) return res.status(400).json({ message: validationError });
  await validateCategorySelection(values.category, values.subcategory);
  const product = await Product.create(values);
  const populated = await populateProduct(Product.findById(product.id)).lean();
  return res.status(201).json({ product: populated });
}

export async function updateProduct(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const existing = await Product.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Product not found.' });
  const values = productValues(req, existing);
  const validationError = validateProductValues(values);
  if (validationError) return res.status(400).json({ message: validationError });
  await validateCategorySelection(values.category, values.subcategory);
  Object.assign(existing, values);
  await existing.save();
  const populated = await populateProduct(Product.findById(existing.id)).lean();
  return res.json({ product: populated });
}

export async function deleteProduct(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid product ID.' });
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ message: 'Product deleted.' });
}
