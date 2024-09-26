import mongoose from 'mongoose';

const snakeGameSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    snakeState: {
        type: Object, // Stores the current state of the snake (position, segments, etc.)
        required: true
    },
    playCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SnakeGame = mongoose.model('SnakeGame', snakeGameSchema);
export default SnakeGame;
