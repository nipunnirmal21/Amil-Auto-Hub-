import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

export async function dashboardSummary(req, res) {
  const [totalProducts, inStock, lowStock, outOfStock, totalCategories, totalSubcategories, recentlyAdded, recentlyUpdated] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ stockStatus: 'In Stock' }),
    Product.countDocuments({ stockStatus: 'Low Stock' }),
    Product.countDocuments({ stockStatus: 'Out of Stock' }),
    Category.countDocuments(),
    Subcategory.countDocuments(),
    Product.find().populate('category', 'name').sort({ createdAt: -1 }).limit(5).lean(),
    Product.find().populate('category', 'name').sort({ updatedAt: -1 }).limit(5).lean(),
  ]);
  return res.json({
    summary: { totalProducts, inStock, lowStock, outOfStock, totalCategories, totalSubcategories },
    recentlyAdded,
    recentlyUpdated,
  });
}
