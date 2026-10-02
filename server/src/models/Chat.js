import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    lastMessage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
