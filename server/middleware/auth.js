import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Admin authentication is not configured.' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'amil-auto-hub-admin' });
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' });
  }
}

export async function requireActiveAdmin(req, res, next) {
  const user = await AdminUser.findById(req.admin.id);
  if (!user || !user.active) return res.status(401).json({ message: 'This admin account is unavailable.' });
  req.adminUser = user;
  req.admin = { id: user.id, name: user.name, email: user.email, role: user.role };
  return next();
}

export function allowRoles(...roles) {
  return function checkRole(req, res, next) {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    return next();
  };
}
