import AppError from '../utils/appError.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Access denied. Administrator privileges required.', 403));
};
