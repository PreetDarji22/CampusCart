import Order from '../models/Order.js';
import Review from '../models/Review.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Submit rating & review for completed order
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res, next) => {
  const { orderId, rating, comment } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  if (order.status !== 'completed') {
    return next(new AppError('Reviews can only be submitted after an order is marked COMPLETED.', 400));
  }

  if (order.buyerId.toString() !== req.user.id) {
    return next(new AppError('Only the buyer of this completed order can leave a review.', 403));
  }

  const existingReview = await Review.findOne({ orderId });
  if (existingReview) {
    return next(new AppError('A review has already been submitted for this order.', 400));
  }

  const review = await Review.create({
    orderId,
    reviewerId: req.user.id,
    revieweeId: order.sellerId,
    rating: Number(rating),
    comment: comment || ''
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for your rating & feedback!',
    data: review
  });
});

// @desc    Get reviews for a seller
// @route   GET /api/users/:id/reviews
// @access  Public
export const getSellerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ revieweeId: req.params.id })
    .populate('reviewerId', 'name avatarUrl department')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});
