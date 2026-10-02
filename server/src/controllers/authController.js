import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';

// @desc    Register a new student/user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, department, year, rollNumber, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('A user with this email address already exists.', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    department: department || 'Computer Science',
    year: year || 'Senior (Year 4)',
    rollNumber: rollNumber || '',
    phone: phone || ''
  });

  sendTokenResponse(user, 201, res, 'Registration successful!');
});

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password credentials.', 401));
  }

  if (user.isSuspended) {
    return next(new AppError('Account is suspended. Please contact administrator.', 403));
  }

  sendTokenResponse(user, 200, res, 'Logged in successfully!');
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new AppError('No refresh token provided.', 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully.');
  } catch (err) {
    return next(new AppError('Expired or invalid refresh token.', 401));
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Initiate Forgot Password - Generate 6-digit code & save to DB
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide your college email address.', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return next(new AppError('No student account found with this email address.', 404));
  }

  // Generate 6-digit numeric verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set reset code and 15-minute expiration in MongoDB
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  console.log(`[Auth] Password reset code generated for ${email}: ${resetCode}`);

  res.status(200).json({
    success: true,
    message: `Verification code sent for ${email}. (Code: ${resetCode})`,
    resetCode: resetCode // returned for frictionless campus student testing / preview
  });
});

// @desc    Reset Password with 6-digit code in DB
// @route   POST /api/auth/resetpassword
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return next(new AppError('Please provide email, verification reset code, and new password.', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters.', 400));
  }

  // Find user with matching email, code, and unexpired token
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    resetPasswordCode: resetCode.trim(),
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+resetPasswordCode +resetPasswordExpire');

  if (!user) {
    return next(new AppError('Invalid or expired verification code. Please request a new code.', 400));
  }

  // Set new password (will be automatically hashed by pre('save') hook)
  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  console.log(`[Auth] Password successfully updated in MongoDB for ${user.email}`);

  sendTokenResponse(user, 200, res, 'Password reset successfully! You are now logged in.');
});

