import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be non-negative']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500']
    },
    condition: {
      type: String,
      enum: ['Like New', 'Good', 'Fair', 'New'],
      default: 'Good'
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'removed'],
      default: 'available'
    },
    meetupLocation: {
      type: String,
      default: 'Campus Library / Student Center'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search on title & description
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
