import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 120 },
  slug: { type: String, required: true, lowercase: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true, bufferCommands: false });

subcategorySchema.index({ parentCategory: 1, slug: 1 }, { unique: true });

export default mongoose.model('Subcategory', subcategorySchema);
