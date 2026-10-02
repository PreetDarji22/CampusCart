import mongoose from 'mongoose';
import User from './User.js';

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Recalculate seller rating after saving review
reviewSchema.post('save', async function () {
  const ReviewModel = this.constructor;
  const stats = await ReviewModel.aggregate([
    { $match: { revieweeId: this.revieweeId } },
    {
      $group: {
        _id: '$revieweeId',
        avgRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(this.revieweeId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      ratingsCount: stats[0].ratingsCount
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
