import Category from '../models/Category.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, icon } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const existing = await Category.findOne({ slug });
  if (existing) {
    return next(new AppError('Category with this name already exists.', 400));
  }

  const category = await Category.create({ name, slug, icon });
  res.status(201).json({
    success: true,
    data: category
  });
});
