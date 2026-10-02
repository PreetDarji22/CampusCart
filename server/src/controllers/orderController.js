import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getIO } from '../config/socket.js';

// Helper to send real-time notification
const sendNotification = async (userId, type, message, relatedId) => {
  try {
    const notif = await Notification.create({ userId, type, message, relatedId });
    const io = getIO();
    io.to(`user:${userId}`).emit('notification', notif);
  } catch (err) {
    console.log('[Notification Error]', err.message);
  }
};

// @desc    Create purchase request / order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, offeredPrice, notes } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== 'available') {
    return next(new AppError('Product is no longer available for purchase.', 400));
  }

  if (product.sellerId.toString() === req.user.id) {
    return next(new AppError('You cannot send a purchase request for your own product listing.', 400));
  }

  const order = await Order.create({
    productId,
    buyerId: req.user.id,
    sellerId: product.sellerId,
    offeredPrice: offeredPrice || product.price,
    notes: notes || ''
  });

  await sendNotification(
    product.sellerId,
    'order_request',
    `${req.user.name} sent a purchase request for "${product.title}" (₹${offeredPrice || product.price})`,
    order._id
  );

  res.status(201).json({
    success: true,
    message: 'Purchase request sent to seller!',
    data: order
  });
});

// @desc    Seller accepts purchase request
// @route   PATCH /api/orders/:id/accept
// @access  Private
export const acceptOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('productId buyerId sellerId');

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  if (order.sellerId._id.toString() !== req.user.id) {
    return next(new AppError('Only the seller can accept this purchase request.', 403));
  }

  if (order.status !== 'pending') {
    return next(new AppError(`Order is already ${order.status}.`, 400));
  }

  order.status = 'accepted';
  await order.save();

  // Mark product status as reserved
  await Product.findByIdAndUpdate(order.productId._id, { status: 'reserved' });

  await sendNotification(
    order.buyerId._id,
    'order_accepted',
    `${order.sellerId.name} accepted your purchase request for "${order.productId.title}"! Please arrange a campus meetup.`,
    order._id
  );

  res.status(200).json({
    success: true,
    message: 'Purchase request accepted! Meetup pending.',
    data: order
  });
});

// @desc    Seller rejects purchase request
// @route   PATCH /api/orders/:id/reject
// @access  Private
export const rejectOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('productId buyerId sellerId');

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  if (order.sellerId._id.toString() !== req.user.id) {
    return next(new AppError('Only the seller can reject this request.', 403));
  }

  order.status = 'rejected';
  await order.save();

  await sendNotification(
    order.buyerId._id,
    'order_rejected',
    `Your request for "${order.productId.title}" was declined by the seller.`,
    order._id
  );

  res.status(200).json({
    success: true,
    message: 'Order request declined.',
    data: order
  });
});

// @desc    Mark order completed (handoff done)
// @route   PATCH /api/orders/:id/complete
// @access  Private
export const completeOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('productId buyerId sellerId');

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  if (order.sellerId._id.toString() !== req.user.id && order.buyerId._id.toString() !== req.user.id) {
    return next(new AppError('Unauthorized.', 403));
  }

  order.status = 'completed';
  await order.save();

  // Mark product as sold
  await Product.findByIdAndUpdate(order.productId._id, { status: 'sold' });

  await sendNotification(
    order.buyerId._id,
    'product_sold',
    `Order for "${order.productId.title}" is marked COMPLETED. Please leave a seller rating & review!`,
    order._id
  );

  res.status(200).json({
    success: true,
    message: 'Order completed! You can now leave a seller review.',
    data: order
  });
});

// @desc    Get user orders (My Purchases & My Sales)
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const purchases = await Order.find({ buyerId: req.user.id })
    .populate('productId sellerId')
    .sort({ createdAt: -1 });

  const sales = await Order.find({ sellerId: req.user.id })
    .populate('productId buyerId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      purchases,
      sales
    }
  });
});
