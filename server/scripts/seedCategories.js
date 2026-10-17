import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import storefrontCategories from '../../client/src/data/categories.js';

async function seedCategories() {
  await connectDatabase();
  let categoriesCreated = 0;
  let categoriesSkipped = 0;
  let subcategoriesCreated = 0;
  let subcategoriesSkipped = 0;

  for (const definition of storefrontCategories.filter(category => category.id !== 'all')) {
    let category = await Category.findOne({
      $or: [{ slug: definition.id }, { name: definition.label }],
    });
    if (category) {
      categoriesSkipped += 1;
    } else {
      category = await Category.create({ name: definition.label, slug: definition.id, active: true });
      categoriesCreated += 1;
    }

    for (const [slug, name] of definition.subcategories) {
      const exists = await Subcategory.exists({
        parentCategory: category._id,
        $or: [{ slug }, { name }],
      });
      if (exists) {
        subcategoriesSkipped += 1;
      } else {
        await Subcategory.create({ name, slug, parentCategory: category._id, active: true });
        subcategoriesCreated += 1;
      }
    }
  }

  console.log(`Category seed complete: ${categoriesCreated} created, ${categoriesSkipped} skipped; ${subcategoriesCreated} subcategories created, ${subcategoriesSkipped} skipped.`);
}

seedCategories()
  .catch(error => {
    console.error(`Category seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
