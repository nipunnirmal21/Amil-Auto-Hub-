import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  icon: { type: String, trim: true, maxLength: 80, default: 'circle-dot' },
  active: { type: Boolean, default: true },
}, { timestamps: true, bufferCommands: false });

export default mongoose.model('Category', categorySchema);
