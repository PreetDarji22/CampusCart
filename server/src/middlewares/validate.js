import { validationResult } from 'express-validator';
import AppError from '../utils/appError.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(`Validation Error: ${extractedErrors}`, 400));
  };
};
