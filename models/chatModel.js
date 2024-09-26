import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

const chatSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',  // Reference to the game that the chat room is linked to
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;