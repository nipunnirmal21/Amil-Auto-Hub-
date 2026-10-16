import mongoose from 'mongoose';

export const stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

export function stockStatusFor(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= 5) return 'Low Stock';
  return 'In Stock';
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 200 },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  brand: { type: String, trim: true, maxLength: 100, default: '' },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  stockStatus: { type: String, enum: stockStatuses, default: 'Out of Stock' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', default: null, index: true },
  shortDescription: { type: String, trim: true, maxLength: 500, default: '' },
  description: { type: String, trim: true, maxLength: 5000, default: '' },
  mainImage: { type: String, required: true, trim: true },
  images: [{ type: String, trim: true }],
  sku: { type: String, trim: true, maxLength: 100, default: '' },
  vehicleCompatibility: { type: String, trim: true, maxLength: 2000, default: '' },
  specifications: { type: Map, of: String, default: {} },
  features: [{ type: String, trim: true, maxLength: 300 }],
  warranty: { type: String, trim: true, maxLength: 1000, default: '' },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true, bufferCommands: false });

productSchema.pre('validate', function setStockStatus() {
  this.stockStatus = stockStatusFor(this.stockQuantity);
});

export default mongoose.model('Product', productSchema);
