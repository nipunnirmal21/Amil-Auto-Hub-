import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import AdminUser from '../models/AdminUser.js';

const name = String(process.env.ADMIN_NAME || 'Amil Auto Hub Admin').trim();
const email = String(process.env.ADMIN_EMAIL || 'admin@amilautohub.com').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || '');

if (password.length < 10) {
  console.error('Set ADMIN_PASSWORD to a value of at least 10 characters before running this script.');
  process.exitCode = 1;
} else {
  try {
    await connectDatabase();
    const existing = await AdminUser.findOne({ email }).select('_id email').lean();
    if (existing) {
      console.log('Admin user already exists');
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await AdminUser.create({
        name,
        email,
        passwordHash,
        role: 'Admin',
        active: true,
      });
      console.log(`Admin user created: ${user.email}`);
    }
  } catch (error) {
    console.error(`Unable to create admin user: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
}
