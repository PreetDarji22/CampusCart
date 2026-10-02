import Report from '../models/Report.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Submit a safety/abuse report
// @route   POST /api/reports
// @access  Private
export const createReport = asyncHandler(async (req, res, next) => {
  const { targetType = 'product', targetId, reason } = req.body;

  if (!targetId || !reason) {
    return next(new AppError('Target ID and report reason are required.', 400));
  }

  const report = await Report.create({
    reporterId: req.user.id,
    targetType,
    targetId,
    reason,
    status: 'pending'
  });

  const populated = await Report.findById(report._id).populate('reporterId', 'name email department');

  res.status(201).json({
    success: true,
    message: 'Report submitted to campus moderation team.',
    data: populated
  });
});
