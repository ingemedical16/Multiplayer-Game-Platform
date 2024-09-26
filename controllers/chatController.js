import Chat from '../models/chatModel.js';
import Game from '../models/gameModel.js';

// Create a new chat room (usually created with a game)
export const createChatRoom = async (req, res) => {
  const { gameId } = req.body;
  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const chatRoom = new Chat({
      name: game.name,  // Using the game name as the chat room name
      game: gameId,
      messages: []
    });

    await chatRoom.save();

    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat room', error });
  }
};

// Get a chat room by game ID
export const getChatRoomByGameId = async (req, res) => {
  const { gameId } = req.params;
  try {
    const chatRoom = await Chat.findOne({ game: gameId });
    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat room', error });
  }
};

// Send a message to a chat room
export const sendMessage = async (req, res) => {
  const { chatRoomId } = req.params;
  const { message } = req.body;

  try {
    const chatRoom = await Chat.findById(chatRoomId);
    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });

    const newMessage = {
      user: req.user._id,  // Assuming you're using JWT and have access to req.user
      message
    };

    chatRoom.messages.push(newMessage);

    await chatRoom.save();

    const io = req.app.get('socketio');
    io.emit('newMessage', { chatRoomId, message: newMessage });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Create or retrieve a private chat between two users
export const createOrGetPrivateChat = async (req, res) => {
    const io = req.app.get('socketio');
    const { recipientId } = req.body;  // The ID of the user to chat with
  
    try {
      // Ensure both users exist
      const sender = await User.findById(req.user._id);
      const recipient = await User.findById(recipientId);
  
      if (!sender || !recipient) return res.status(404).json({ message: 'User not found' });
  
      // Check if a private chat between these two users already exists
      let privateChat = await Chat.findOne({
        isPrivate: true,
        users: { $all: [req.user._id, recipientId] },
      });
  
      if (!privateChat) {
        // If no chat exists, create a new one
        privateChat = new Chat({
          name: `${sender.username} and ${recipient.username}`,
          isPrivate: true,
          users: [req.user._id, recipientId],
        });
  
        await privateChat.save();
      }
  
      res.status(200).json(privateChat);
    } catch (error) {
      res.status(500).json({ message: 'Error creating or fetching private chat', error });
    }
  };
  
  // Send a message to a private chat room
  export const sendPrivateMessage = async (req, res) => {
    const { chatRoomId } = req.params;
    const { message } = req.body;
  
    try {
      const chatRoom = await Chat.findById(chatRoomId);
      if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });
  
      // Ensure the user is a participant in the chat room
      if (!chatRoom.participants.includes(req.user._id)) {
        return res.status(403).json({ message: 'You are not a participant of this chat' });
      }
  
      const newMessage = {
        user: req.user._id,  // Assuming you have user info from JWT
        message,
      };
  
      chatRoom.messages.push(newMessage);
      await chatRoom.save();
  
      const io = req.app.get('socketio');
      io.emit('newPrivateMessage', { chatRoomId, message: newMessage });
  
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error });
    }
  };

// Handle real-time chat events
export const handleChat = (socket, io) => {
    // Join a chat room
    socket.on('joinRoom', async ({ roomId }) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
  
      // Optionally notify others in the room
      socket.to(roomId).emit('message', 'A new user has joined the chat');
    });
  
    // Handle group chat messages
    socket.on('groupMessage', async ({ roomId, message }) => {
      // Assuming you have user information from authentication
      const userId = socket.handshake.query.userId; // Adjust as per your auth implementation
  
      // Save message to DB
      const chatRoom = await Chat.findById(roomId);
      if (chatRoom) {
        chatRoom.messages.push({ user: userId, message });
        await chatRoom.save();
  
        // Emit the message to all clients in the room
        io.to(roomId).emit('newMessage', { chatRoomId: roomId, message: { user: userId, message } });
      }
    });
  
    // Handle private chat messages
    socket.on('privateMessage', async ({ roomId, message }) => {
      const userId = socket.handshake.query.userId; // Adjust as per your auth implementation
  
      const chatRoom = await Chat.findById(roomId);
      if (chatRoom && chatRoom.isPrivate) {
        chatRoom.messages.push({ user: userId, message });
        await chatRoom.save();
  
        // Emit the message to all clients in the private room
        io.to(roomId).emit('newPrivateMessage', { chatRoomId: roomId, message: { user: userId, message } });
      }
    });
  };
