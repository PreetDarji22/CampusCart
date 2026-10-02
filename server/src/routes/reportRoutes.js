import express from 'express';
import { createReport } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReport);

export default router;
