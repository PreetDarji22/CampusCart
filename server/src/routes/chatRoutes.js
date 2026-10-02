import express from 'express';
import { getChatMessages, getOrCreateChat, getUserChats, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', getOrCreateChat);
router.get('/', getUserChats);
router.get('/:id/messages', getChatMessages);
router.post('/:id/messages', sendMessage);

export default router;
