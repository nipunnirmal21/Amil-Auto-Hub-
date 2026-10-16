import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';

export async function listAdminUsers(req, res) {
  const users = await AdminUser.find().sort({ name: 1 }).lean();
  return res.json({ users });
}

export async function createAdminUser(req, res) {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = req.body.role === 'Admin' ? 'Admin' : 'Staff';
  if (!name || !email || password.length < 10) {
    return res.status(400).json({ message: 'Name, email, and a password of at least 10 characters are required.' });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await AdminUser.create({ name, email, passwordHash, role, active: req.body.active !== false });
  return res.status(201).json({ user });
}

export async function updateAdminUser(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid user ID.' });
  const user = await AdminUser.findById(req.params.id).select('+passwordHash');
  if (!user) return res.status(404).json({ message: 'Admin user not found.' });
  if (String(user._id) === req.admin.id && req.body.active === false) {
    return res.status(400).json({ message: 'You cannot deactivate your own account.' });
  }
  if (req.body.name !== undefined) user.name = String(req.body.name).trim();
  if (req.body.email !== undefined) user.email = String(req.body.email).trim().toLowerCase();
  if (req.body.role !== undefined) user.role = req.body.role === 'Admin' ? 'Admin' : 'Staff';
  if (typeof req.body.active === 'boolean') user.active = req.body.active;
  if (req.body.password) {
    if (String(req.body.password).length < 10) return res.status(400).json({ message: 'Password must contain at least 10 characters.' });
    user.passwordHash = await bcrypt.hash(String(req.body.password), 12);
  }
  await user.save();
  return res.json({ user: user.toJSON() });
}

export async function deleteAdminUser(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) return res.status(400).json({ message: 'Invalid user ID.' });
  if (req.params.id === req.admin.id) return res.status(400).json({ message: 'You cannot delete your own account.' });
  const user = await AdminUser.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Admin user not found.' });
  return res.json({ message: 'Admin user deleted.' });
}
