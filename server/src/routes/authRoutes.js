import express from 'express';
import { body } from 'express-validator';
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid college email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  login
);

router.post(
  '/forgotpassword',
  validate([
    body('email').isEmail().withMessage('Valid college email is required')
  ]),
  forgotPassword
);

router.post(
  '/resetpassword',
  validate([
    body('email').isEmail().withMessage('Valid college email is required'),
    body('resetCode').notEmpty().withMessage('Verification reset code is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ]),
  resetPassword
);

router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

export default router;

