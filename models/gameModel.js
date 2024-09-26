import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,   // Full description for the game page
    required: true,
  },
  shortDescription: {
    type: String,   // Short description for game listing cards
    required: true,
  },
  gameType: {
    type: String,   
    enum: ['Single-player', 'Two-player','Multiplayer'],
    required: true,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5 }
  }],
  instructions: {
    type: String,  // Instructions on how to play the game
    required: true,
  },
  pageLink: {
    type: String,  // Link to the game page (used for frontend routing)
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);
export default Game;

