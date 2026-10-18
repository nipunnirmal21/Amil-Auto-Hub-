import mongoose from 'mongoose';
import Billboard from '../models/Billboard.js';

const publicFields = '_id image caption date active';
const isTrue = value => value === true || value === 'true' || value === '1';

export async function currentBillboard(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'The daily board is temporarily unavailable.' });
  const billboard = await Billboard.findOne({ active: true, publishedAt: { $ne: null } })
    .select(publicFields)
    .sort({ date: -1, createdAt: -1, _id: -1 })
    .lean();
  return res.json({ billboard });
}

export async function publishedBillboardHistory(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'The daily board history is temporarily unavailable.' });
  const billboards = await Billboard.find({ publishedAt: { $ne: null } })
    .select(publicFields)
    .sort({ date: -1, createdAt: -1, _id: -1 })
    .limit(200)
    .lean();
  return res.json({ billboards });
}

export async function listBillboards(req, res) {
  const billboards = await Billboard.find().sort({ date: -1, createdAt: -1, _id: -1 }).limit(200).lean();
  return res.json({ billboards });
}

export async function createBillboard(req, res) {
  if (!req.file) return res.status(400).json({ message: 'A billboard image is required.' });
  const active = req.body.active !== 'false';
  const published = active || isTrue(req.body.published);
  if (active) await Billboard.updateMany({ active: true }, { active: false });
  const billboard = await Billboard.create({
    image: `/api/uploads/billboards/${req.file.filename}`,
    caption: String(req.body.caption || "Today's Board").trim(),
    date: req.body.date ? new Date(req.body.date) : new Date(),
    active,
    publishedAt: published ? new Date() : null,
  });
  return res.status(201).json({ billboard });
}

export async function updateBillboard(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid billboard ID.' });
  const billboard = await Billboard.findById(req.params.id);
  if (!billboard) return res.status(404).json({ message: 'Billboard not found.' });
  let active = req.body.active === undefined ? billboard.active : isTrue(req.body.active);
  const published = active || (req.body.published === undefined ? Boolean(billboard.publishedAt) : isTrue(req.body.published));
  if (!published) active = false;
  if (active) await Billboard.updateMany({ _id: { $ne: billboard._id }, active: true }, { active: false });
  if (req.file) billboard.image = `/api/uploads/billboards/${req.file.filename}`;
  if (req.body.caption !== undefined) billboard.caption = String(req.body.caption).trim();
  if (req.body.date) billboard.date = new Date(req.body.date);
  billboard.active = active;
  billboard.publishedAt = published ? billboard.publishedAt || new Date() : null;
  await billboard.save();
  return res.json({ billboard });
}

export async function deleteBillboard(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid billboard ID.' });
  const billboard = await Billboard.findByIdAndDelete(req.params.id);
  if (!billboard) return res.status(404).json({ message: 'Billboard not found.' });
  return res.json({ message: 'Billboard deleted.' });
}
