import Wishlist from '../models/Wishlist.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ userId: req.user.id }).populate({
    path: 'productId',
    populate: { path: 'sellerId category' }
  });

  const products = items.map((item) => item.productId).filter((prod) => prod && prod.status !== 'removed');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const existing = await Wishlist.findOne({ userId: req.user.id, productId });
  if (existing) {
    return res.status(200).json({ success: true, message: 'Item already in wishlist' });
  }

  await Wishlist.create({ userId: req.user.id, productId });

  res.status(201).json({
    success: true,
    message: 'Added to wishlist!'
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  await Wishlist.findOneAndDelete({ userId: req.user.id, productId });

  res.status(200).json({
    success: true,
    message: 'Removed from wishlist.'
  });
});
