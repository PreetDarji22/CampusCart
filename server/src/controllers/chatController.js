import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getIO } from '../config/socket.js';

// @desc    Get or create chat session with another user/seller
// @route   POST /api/chats
// @access  Private
export const getOrCreateChat = asyncHandler(async (req, res, next) => {
  const { recipientId, productId } = req.body;

  if (!recipientId) {
    return next(new AppError('Recipient ID is required.', 400));
  }

  // Find existing chat room with these 2 participants
  let chat = await Chat.findOne({
    participants: { $all: [req.user.id, recipientId] }
  }).populate('participants productId');

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user.id, recipientId],
      productId: productId || null
    });
    chat = await Chat.findById(chat._id).populate('participants productId');
  }

  res.status(200).json({
    success: true,
    data: chat
  });
});

// @desc    Get all active user chat conversations
// @route   GET /api/chats
// @access  Private
export const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    participants: req.user.id
  })
    .populate('participants', 'name email avatarUrl department')
    .populate('productId', 'title price images')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats
  });
});

// @desc    Get message history for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new AppError('Chat conversation not found.', 404));
  }

  if (!chat.participants.includes(req.user.id)) {
    return next(new AppError('Unauthorized to view this conversation.', 403));
  }

  const messages = await Message.find({ chatId: req.params.id })
    .populate('senderId', 'name avatarUrl')
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Send message in a chat
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.includes(req.user.id)) {
    return next(new AppError('Unauthorized or invalid chat conversation.', 403));
  }

  const message = await Message.create({
    chatId,
    senderId: req.user.id,
    text
  });

  // Update last message preview in Chat
  chat.lastMessage = text;
  await chat.save();

  const populatedMessage = await Message.findById(message._id).populate('senderId', 'name avatarUrl');

  // Emit real-time Socket.io event to room
  try {
    const io = getIO();
    io.to(`chat:${chatId}`).emit('new_message', populatedMessage);
  } catch (err) {
    console.log('[Socket Emit Note]', err.message);
  }

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});
