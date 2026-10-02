import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.refreshToken) {
    token = req.cookies.refreshToken;
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (user.isSuspended) {
      return next(new AppError('Your account has been suspended by an administrator.', 403));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Token verification failed or token expired.', 401));
  }
});

// Grant access to specific roles (e.g. 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`User role (${req.user?.role || 'guest'}) is not authorized to access this route.`, 403)
      );
    }
    next();
  };
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Access denied. Administrator privileges required.', 403));
};

