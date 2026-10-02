import mongoose from 'mongoose';

const registeredUserSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rollNumber: { type: String, default: '' },
    department: { type: String, default: 'General' },
    ticketId: { type: String, required: true },
    ticketsCount: { type: Number, default: 1 },
    amountPaid: { type: Number, default: 0 },
    bookedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Hackathon', 'Exhibition', 'Sports', 'Workshop', 'Cultural', 'Tech Fest', 'Other'],
      default: 'Tech Fest'
    },
    date: {
      type: String,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      default: '09:00 AM - 05:00 PM'
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required']
    },
    entryFee: {
      type: Number,
      default: 0
    },
    totalSlots: {
      type: Number,
      default: 100
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    registeredUsers: [registeredUserSchema],
    gearTag: {
      type: String,
      default: 'Marketplace Gear Recommended'
    },
    organizer: {
      type: String,
      default: 'Campus Student Council & Faculty'
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
