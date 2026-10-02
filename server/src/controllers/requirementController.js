import Requirement from '../models/Requirement.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all active student requirements with optional filters
// @route   GET /api/requirements
// @access  Public
export const getRequirements = asyncHandler(async (req, res, next) => {
  const { category, department, urgent, search } = req.query;

  const queryObj = { status: 'active' };

  if (category && category !== 'All Categories') {
    queryObj.category = category;
  }

  if (department && department !== 'All Departments') {
    queryObj.department = department;
  }

  if (urgent === 'true') {
    queryObj.urgent = true;
  }

  if (search) {
    queryObj.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const requirements = await Requirement.find(queryObj).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: requirements.length,
    data: requirements
  });
});

// @desc    Create a new student requirement
// @route   POST /api/requirements
// @access  Public (or Protected)
export const createRequirement = asyncHandler(async (req, res, next) => {
  const { title, category, department, budget, urgent, preferredMeetup, description } = req.body;

  if (!title || !description) {
    return next(new AppError('Title and description are required fields.', 400));
  }

  const postedBy = {
    name: req.user?.name || req.body.postedBy?.name || 'Campus Student',
    email: req.user?.email || req.body.postedBy?.email || '',
    avatar: req.user?.avatarUrl || req.body.postedBy?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: req.user?.department || department || 'General',
    year: req.user?.year || 'Student',
    verified: req.user?.isVerified ?? true,
    userId: req.user?._id || null
  };

  const newRequirement = await Requirement.create({
    title,
    category: category || 'Misc',
    department: department || 'General',
    budget: budget || 'Negotiable',
    urgent: Boolean(urgent),
    preferredMeetup: preferredMeetup || 'Central Library Lobby & Steps',
    description,
    postedBy
  });

  res.status(201).json({
    status: 'success',
    data: newRequirement
  });
});

// @desc    Delete a student requirement
// @route   DELETE /api/requirements/:id
// @access  Public (or Protected)
export const deleteRequirement = asyncHandler(async (req, res, next) => {
  const requirement = await Requirement.findById(req.params.id);

  if (!requirement) {
    return next(new AppError('Requirement not found with that ID', 404));
  }

  await Requirement.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Requirement deleted successfully'
  });
});

// @desc    Mark a student requirement as fulfilled
// @route   PATCH /api/requirements/:id/fulfill
// @access  Public (or Protected)
export const fulfillRequirement = asyncHandler(async (req, res, next) => {
  const requirement = await Requirement.findByIdAndUpdate(
    req.params.id,
    { status: 'fulfilled' },
    { new: true, runValidators: true }
  );

  if (!requirement) {
    return next(new AppError('Requirement not found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: requirement
  });
});
