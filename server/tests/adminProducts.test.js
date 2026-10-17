import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import { validateCategorySelection } from '../controllers/adminProducts.js';

test('product category validation rejects an invalid main category ID', async () => {
  await assert.rejects(() => validateCategorySelection('storefront-slug', ''), {
    message: 'Select a valid main category.',
    status: 400,
  });
});

test('product category validation rejects a subcategory from another category', async () => {
  const categoryId = new mongoose.Types.ObjectId().toString();
  const subcategoryId = new mongoose.Types.ObjectId().toString();
  const findById = Category.findById;
  const findOne = Subcategory.findOne;
  try {
    Category.findById = async () => ({ _id: categoryId });
    Subcategory.findOne = async () => null;
    await assert.rejects(() => validateCategorySelection(categoryId, subcategoryId), {
      message: 'The selected subcategory does not belong to this category.',
      status: 400,
    });
  } finally {
    Category.findById = findById;
    Subcategory.findOne = findOne;
  }
});

test('product category validation accepts a matching category and subcategory', async () => {
  const categoryId = new mongoose.Types.ObjectId().toString();
  const subcategoryId = new mongoose.Types.ObjectId().toString();
  const findById = Category.findById;
  const findOne = Subcategory.findOne;
  try {
    Category.findById = async () => ({ _id: categoryId });
    Subcategory.findOne = async query => query;
    await assert.doesNotReject(() => validateCategorySelection(categoryId, subcategoryId));
  } finally {
    Category.findById = findById;
    Subcategory.findOne = findOne;
  }
});
