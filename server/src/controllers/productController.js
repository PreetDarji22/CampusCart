import Category from '../models/Category.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all products with filtering, search & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, condition, status, sort, page = 1, limit = 20, sellerId } = req.query;

  const query = {};

  // Status filter (defaults to available unless explicitly provided)
  if (status) {
    query.status = status;
  } else {
    query.status = { $ne: 'removed' };
  }

  // Seller filter
  if (sellerId) {
    query.sellerId = sellerId;
  }

  // Category filter
  if (category && category !== 'All Categories') {
    const catObj = await Category.findOne({ name: category });
    if (catObj) {
      query.category = catObj._id;
    }
  }

  // Condition filter
  if (condition) {
    query.condition = condition;
  }

  // Price Range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOptions = { createdAt: -1 };
  if (sort === 'price_asc') sortOptions = { price: 1 };
  if (sort === 'price_desc') sortOptions = { price: -1 };
  if (sort === 'oldest') sortOptions = { createdAt: 1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug icon')
    .populate('sellerId', 'name email avatarUrl avgRating verified department year phone')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: products
  });
});

// @desc    Search products using MongoDB $text index
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(200).json({ success: true, count: 0, data: [] });
  }

  const products = await Product.find({
    $text: { $search: q },
    status: { $ne: 'removed' }
  })
    .populate('category', 'name icon')
    .populate('sellerId', 'name avatarUrl avgRating department');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug icon')
    .populate('sellerId', 'name email avatarUrl avgRating ratingsCount verified department year phone rollNumber');

  if (!product || product.status === 'removed') {
    return next(new AppError('Product not found.', 404));
  }

  // Increment views count
  product.views += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product listing
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, originalPrice, category, images, condition, meetupLocation } = req.body;

  let categoryDoc;
  if (category) {
    categoryDoc = await Category.findOne({
      $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { name: category }]
    });
  }

  if (!categoryDoc) {
    categoryDoc = await Category.findOne(); // default fallback category
  }

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : 0,
    category: categoryDoc._id,
    sellerId: req.user.id,
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    condition: condition || 'Good',
    meetupLocation: meetupLocation || 'Campus Student Union'
  });

  const populated = await Product.findById(product._id)
    .populate('category', 'name icon')
    .populate('sellerId', 'name avatarUrl avgRating verified department year');

  res.status(201).json({
    success: true,
    message: 'Listing created successfully!',
    data: populated
  });
});

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private (Owner/Admin)
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  // Authorization check
  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to edit this listing.', 403));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('category sellerId');

  res.status(200).json({
    success: true,
    message: 'Listing updated successfully.',
    data: product
  });
});

// @desc    Update product status (available / sold / reserved)
// @route   PATCH /api/products/:id/status
// @access  Private (Owner/Admin)
export const updateProductStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Unauthorized to update product status.', 403));
  }

  product.status = status;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product status updated to ${status}.`,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner/Admin)
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Unauthorized to delete this product.', 403));
  }

  // Soft delete by marking as removed
  product.status = 'removed';
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product listing deleted successfully.'
  });
});
