import mongoose from 'mongoose';

const billboardSchema = new mongoose.Schema({
  image: { type: String, required: true, trim: true },
  caption: { type: String, trim: true, maxLength: 240, default: "Today's Board" },
  date: { type: Date, required: true, default: Date.now },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true, bufferCommands: false });

export default mongoose.model('Billboard', billboardSchema);
