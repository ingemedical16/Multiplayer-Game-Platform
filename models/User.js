import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  favoriteGames: [String],
  gameStats: {
    gamesPlayed: { type: Number, default: 0 },
    highScores: { type: Map, of: Number }, // key: game name, value: high score
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
