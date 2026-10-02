import express from 'express';
import {
  acceptOrder,
  completeOrder,
  createOrder,
  getMyOrders,
  rejectOrder
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.patch('/:id/accept', acceptOrder);
router.patch('/:id/reject', rejectOrder);
router.patch('/:id/complete', completeOrder);

export default router;
