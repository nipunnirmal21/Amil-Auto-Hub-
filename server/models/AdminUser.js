import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxLength: 240 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['Admin', 'Staff'], default: 'Staff' },
  active: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true, bufferCommands: false });

adminUserSchema.set('toJSON', {
  transform(_document, value) {
    delete value.passwordHash;
    return value;
  },
});

export default mongoose.model('AdminUser', adminUserSchema);
