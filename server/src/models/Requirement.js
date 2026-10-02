import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a requirement title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Misc'
    },
    department: {
      type: String,
      default: 'General'
    },
    budget: {
      type: String,
      default: 'Negotiable'
    },
    urgent: {
      type: Boolean,
      default: false
    },
    preferredMeetup: {
      type: String,
      default: 'Central Library Lobby & Steps'
    },
    description: {
      type: String,
      required: [true, 'Please provide requirement details'],
      trim: true
    },
    postedBy: {
      name: { type: String, default: 'Campus Student' },
      email: { type: String },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      department: { type: String, default: 'General' },
      year: { type: String, default: 'Student' },
      verified: { type: Boolean, default: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    status: {
      type: String,
      enum: ['active', 'fulfilled', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Requirement = mongoose.model('Requirement', requirementSchema);

export default Requirement;
