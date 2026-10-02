import express from 'express';
import { getUserById, updateMe } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/me', protect, updateMe);
router.get('/:id', getUserById);

export default router;
