import multer from 'multer';
import path from 'path';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Configure Multer Disk Storage for uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const mimeCheck = allowed.test(file.mimetype);
  const extCheck = allowed.test(path.extname(file.originalname).toLowerCase());

  if (mimeCheck && extCheck) {
    return cb(null, true);
  }
  cb(new AppError('Only image files (jpg, png, webp) are allowed.', 400));
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
export const uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please choose an image file to upload.', 400));
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    url
  });
});
