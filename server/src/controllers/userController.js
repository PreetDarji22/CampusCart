import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
export const updateMe = asyncHandler(async (req, res, next) => {
  const { name, department, year, phone, avatarUrl, rollNumber } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, department, year, phone, avatarUrl, rollNumber },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    data: updatedUser
  });
});

// @desc    Get public user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return next(new AppError('User profile not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});
