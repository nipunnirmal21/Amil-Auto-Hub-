import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';

export async function login(req, res) {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Admin login is temporarily unavailable.' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Admin authentication is not configured.' });
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await AdminUser.findOne({ email }).select('+passwordHash');
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  user.lastLoginAt = new Date();
  await user.save();
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h', issuer: 'amil-auto-hub-admin' },
  );
  return res.json({ token, user: user.toJSON() });
}

export async function currentAdmin(req, res) {
  return res.json({ user: req.adminUser });
}
