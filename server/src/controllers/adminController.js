import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get system dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalListings = await Product.countDocuments({ status: { $ne: 'removed' } });
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ status: 'completed' });
  const pendingReports = await Report.countDocuments({ status: 'pending' });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalListings,
      totalOrders,
      completedOrders,
      pendingReports
    }
  });
});

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Suspend or activate user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
export const toggleUserSuspend = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.role === 'admin') {
    return next(new AppError('Cannot suspend another administrator account.', 403));
  }

  user.isSuspended = !user.isSuspended;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isSuspended ? 'suspended' : 'reactivated'} successfully.`,
    data: user
  });
});

// @desc    Admin remove product listing
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
export const adminDeleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  product.status = 'removed';
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Listing removed by administrator.'
  });
});

// @desc    Get moderation reports queue
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('reporterId', 'name email').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Resolve report
// @route   PATCH /api/admin/reports/:id/resolve
// @access  Private (Admin)
export const resolveReport = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const report = await Report.findByIdAndUpdate(req.params.id, { status: status || 'resolved' }, { new: true });

  if (!report) {
    return next(new AppError('Report not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Report resolved.',
    data: report
  });
});
