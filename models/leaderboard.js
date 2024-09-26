// models/leaderboard.js
import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  game: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Leaderboard', leaderboardSchema);
