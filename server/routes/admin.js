import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, currentAdmin } from '../controllers/auth.js';
import {
  listAdminProducts, getAdminProduct, createProduct, updateProduct, deleteProduct,
} from '../controllers/adminProducts.js';
import {
  listAdminCategories, createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
} from '../controllers/categories.js';
import {
  listBillboards, createBillboard, updateBillboard, deleteBillboard,
} from '../controllers/billboards.js';
import {
  listAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser,
} from '../controllers/adminUsers.js';
import { dashboardSummary } from '../controllers/dashboard.js';
import { requireAuth, requireActiveAdmin, allowRoles } from '../middleware/auth.js';
import databaseReady from '../middleware/databaseReady.js';
import { billboardUpload, productUpload } from '../middleware/upload.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

router.post('/login', loginLimiter, login);
router.use(requireAuth, databaseReady, requireActiveAdmin);
router.get('/me', currentAdmin);
router.get('/dashboard', dashboardSummary);

router.get('/products', listAdminProducts);
router.get('/products/:id', getAdminProduct);
router.post('/products', productUpload, createProduct);
router.put('/products/:id', productUpload, updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/categories', listAdminCategories);
router.post('/categories', allowRoles('Admin'), createCategory);
router.put('/categories/:id', allowRoles('Admin'), updateCategory);
router.delete('/categories/:id', allowRoles('Admin'), deleteCategory);
router.post('/subcategories', allowRoles('Admin'), createSubcategory);
router.put('/subcategories/:id', allowRoles('Admin'), updateSubcategory);
router.delete('/subcategories/:id', allowRoles('Admin'), deleteSubcategory);

router.get('/billboards', listBillboards);
router.post('/billboards', billboardUpload, createBillboard);
router.put('/billboards/:id', billboardUpload, updateBillboard);
router.delete('/billboards/:id', deleteBillboard);

router.get('/users', allowRoles('Admin'), listAdminUsers);
router.post('/users', allowRoles('Admin'), createAdminUser);
router.put('/users/:id', allowRoles('Admin'), updateAdminUser);
router.delete('/users/:id', allowRoles('Admin'), deleteAdminUser);

export default router;
