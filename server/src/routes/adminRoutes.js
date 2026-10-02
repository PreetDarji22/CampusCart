import express from 'express';
import {
  adminDeleteProduct,
  getAdminStats,
  getAllUsers,
  getReports,
  resolveReport,
  toggleUserSuspend
} from '../controllers/adminController.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/suspend', toggleUserSuspend);
router.delete('/products/:id', adminDeleteProduct);
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

export default router;
