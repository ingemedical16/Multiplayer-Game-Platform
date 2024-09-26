import express from "express";
import {
  sendMessage,
  getChatRoomByGameId,
  createChatRoom,
  createOrGetPrivateChat,
  sendPrivateMessage,
} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import router from "./authRoutes.js";

const router = express.Router();

// Route to get a chat room by game ID
router.get("/game/:gameId", verifyToken, getChatRoomByGameId);

// Route to send a message to a chat room
router.post("/:chatRoomId/message", verifyToken, sendMessage);

// Route to create a new chat room (used when creating a new game)
router.post("/create", verifyToken, createChatRoom);

// Route to get or create a private chat between two users
router.post("/private", verifyToken, createOrGetPrivateChat);

// Route to send a message to a private chat room
router.post("/:chatRoomId/private/message", verifyToken, sendPrivateMessage);

const chatRoutes = router;

export default chatRoutes;
