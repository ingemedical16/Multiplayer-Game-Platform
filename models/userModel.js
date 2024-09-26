import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Only required for local JWT authentication
  },
  isAdmin: {
    type: Boolean,
    default: false,  // Indicates if the user is an admin
  },
  googleId: {
    type: String,
    required: false,
  },
  facebookId: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: 'default.png',
  },
  favoriteGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  }],
  scores: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    score: { type: Number, default: 0 }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;