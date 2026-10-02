import express from 'express';
import { createReview, getSellerReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:id', getSellerReviews);

export default router;
