import express from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadImage);

export default router;
