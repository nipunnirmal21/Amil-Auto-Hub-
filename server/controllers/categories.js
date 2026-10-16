import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Product from '../models/Product.js';
import slugify from '../utils/slugify.js';

async function categoriesWithChildren(activeOnly = false) {
  const categoryFilter = activeOnly ? { active: true } : {};
  const subcategoryFilter = activeOnly ? { active: true } : {};
  const [categories, subcategories] = await Promise.all([
    Category.find(categoryFilter).sort({ name: 1 }).lean(),
    Subcategory.find(subcategoryFilter).sort({ name: 1 }).lean(),
  ]);
  return categories.map(category => ({
    ...category,
    subcategories: subcategories.filter(item => String(item.parentCategory) === String(category._id)),
  }));
}

export async function listCategories(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Categories are temporarily unavailable.' });
  return res.json({ categories: await categoriesWithChildren(true) });
}

export async function listAdminCategories(req, res) {
  return res.json({ categories: await categoriesWithChildren(false) });
}

export async function createCategory(req, res) {
  const name = String(req.body.name || '').trim();
  const slug = slugify(req.body.slug || name);
  if (!name || !slug) return res.status(400).json({ message: 'Category name and slug are required.' });
  const category = await Category.create({
    name,
    slug,
    icon: String(req.body.icon || 'circle-dot').trim(),
    active: req.body.active !== false,
  });
  return res.status(201).json({ category });
}

export async function updateCategory(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid category ID.' });
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  const name = String(req.body.name ?? category.name).trim();
  const slug = slugify(req.body.slug ?? category.slug);
  if (!name || !slug) return res.status(400).json({ message: 'Category name and slug are required.' });
  category.name = name;
  category.slug = slug;
  category.icon = String(req.body.icon ?? category.icon).trim();
  if (typeof req.body.active === 'boolean') category.active = req.body.active;
  await category.save();
  return res.json({ category });
}

export async function deleteCategory(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid category ID.' });
  const [productCount, subcategoryCount] = await Promise.all([
    Product.countDocuments({ category: req.params.id }),
    Subcategory.countDocuments({ parentCategory: req.params.id }),
  ]);
  if (productCount > 0) {
    return res.status(409).json({
      message: `This category is currently used by ${productCount} product${productCount === 1 ? '' : 's'}. Reassign those products before deleting it.`,
      productCount,
    });
  }
  if (subcategoryCount > 0) {
    return res.status(409).json({
      message: `This category still contains ${subcategoryCount} subcategor${subcategoryCount === 1 ? 'y' : 'ies'}. Delete or reassign them first.`,
      subcategoryCount,
    });
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  return res.json({ message: 'Category deleted.' });
}

export async function createSubcategory(req, res) {
  const name = String(req.body.name || '').trim();
  const slug = slugify(req.body.slug || name);
  const parentCategory = req.body.parentCategory;
  if (!name || !slug || !mongoose.isObjectIdOrHexString(parentCategory)) {
    return res.status(400).json({ message: 'Subcategory name and parent category are required.' });
  }
  if (!(await Category.exists({ _id: parentCategory }))) return res.status(400).json({ message: 'Parent category not found.' });
  const subcategory = await Subcategory.create({ name, slug, parentCategory, active: req.body.active !== false });
  return res.status(201).json({ subcategory });
}

export async function updateSubcategory(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid subcategory ID.' });
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) return res.status(404).json({ message: 'Subcategory not found.' });
  const parentCategory = req.body.parentCategory ?? subcategory.parentCategory;
  if (!mongoose.isObjectIdOrHexString(parentCategory) || !(await Category.exists({ _id: parentCategory }))) {
    return res.status(400).json({ message: 'Parent category not found.' });
  }
  subcategory.name = String(req.body.name ?? subcategory.name).trim();
  subcategory.slug = slugify(req.body.slug ?? subcategory.slug);
  subcategory.parentCategory = parentCategory;
  if (typeof req.body.active === 'boolean') subcategory.active = req.body.active;
  await subcategory.save();
  return res.json({ subcategory });
}

export async function deleteSubcategory(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid subcategory ID.' });
  const productCount = await Product.countDocuments({ subcategory: req.params.id });
  if (productCount > 0) {
    return res.status(409).json({
      message: `This subcategory is currently used by ${productCount} product${productCount === 1 ? '' : 's'}. Reassign those products before deleting it.`,
      productCount,
    });
  }
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  if (!subcategory) return res.status(404).json({ message: 'Subcategory not found.' });
  return res.json({ message: 'Subcategory deleted.' });
}
