import Game from "../models/gameModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const createGame = async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    gameType,
    instructions,
    pageLink,
  } = req.body;

  try {
    // Create the game
    const game = new Game({
      name,
      description,
      shortDescription,
      gameType,
      instructions,
      pageLink,
    });

    await game.save();

    // Create a chat room with the same name as the game
    const chatRoom = new Chat({
      roomName: name,
      game: game._id, // Link chat room to the game
    });

    await chatRoom.save();

    res
      .status(201)
      .json({
        message: "Game and chat room created successfully",
        game,
        chatRoom,
      });
  } catch (error) {
    res.status(500).json({ error: "Error creating game and chat room" });
  }
};
export const getGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: "Error fetching game" });
  }
};

export const updateScore = async (req, res) => {
  const { gameId } = req.params;
  const { score } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingScore = user.scores.find((s) => s.game.toString() === gameId);
    if (existingScore) {
      existingScore.score =
        score > existingScore.score ? score : existingScore.score;
    } else {
      user.scores.push({ game: gameId, score });
    }

    await user.save();
    res.json({ message: "Score updated successfully", scores: user.scores });
  } catch (error) {
    res.status(500).json({ error: "Error updating score" });
  }
};

// Increment the play count when a game is played
export const incrementPlayCount = async (req, res) => {
  const io = req.app.get("socketio");
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.playCount += 1;
    await game.save();

    // Emit play count update
    io.emit("playCountUpdate", { gameId: game._id, playCount: game.playCount });

    res
      .status(200)
      .json({ message: "Play count incremented", playCount: game.playCount });
  } catch (error) {
    res.status(500).json({ error: "Error incrementing play count" });
  }
};

// Add a review to a game
export const addReview = async (req, res) => {
  const { gameId } = req.params;
  const { rating, comment } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const user = req.user.id;

    const existingReview = game.reviews.find(
      (review) => review.user.toString() === user
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this game" });
    }

    const review = {
      user,
      rating,
      comment,
    };

    game.reviews.push(review);

    // Calculate the new average rating
    const totalReviews = game.reviews.length;
    const sumRatings = game.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    game.rating = sumRatings / totalReviews;

    await game.save();

    res.json({ message: "Review added successfully", reviews: game.reviews });
  } catch (error) {
    res.status(500).json({ error: "Error adding review" });
  }
};

export const getSinglePlayerGames = async (req, res) => {
  try {
    const games = await Game.find({ gameType: "single-player" }).populate(
      "reviews.user"
    );
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: "Error fetching single-player games" });
  }
};

export const getMultiplayerGames = async (req, res) => {
  try {
    const games = await Game.find({
      gameType: { $in: ["multiplayer", "two-player"] },
    }).populate("reviews.user");
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: "Error fetching multiplayer games" });
  }
};
