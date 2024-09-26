let snakeGames = {}; // Store game states by room
let playersInSnakeRoom = {}; // Store player information for each room
let availableSnakeRooms = []; // Store list of available rooms

export function initSnakeController(socket, io) {

  // Create a new room
  socket.on('createSnakeRoom', ({ roomId, mode, playerName }) => {
    if (snakeGames[roomId]) {
      socket.emit('snakeRoomExists'); // Notify if the room already exists
      return;
    }

    // Initialize room with the creator as player 1
    snakeGames[roomId] = createInitialSnakeState(mode);
    playersInSnakeRoom[roomId] = [{ id: socket.id, playerNumber: 1, playerName}];

    availableSnakeRooms.push({ roomId, mode, players: 1 ,owner:socket.id});

    socket.join(roomId);
    socket.emit('snakeRoomCreated', roomId);
    io.emit('updateSnakeRooms', availableSnakeRooms); // Notify all users about the new room
  });

  // Get the list of available rooms
  socket.on('getSnakeRooms', () => {
    socket.emit('updateSnakeRooms', availableSnakeRooms);
  });

  // Request to join a room
  socket.on('requestJoinRoom', ({ roomId, playerName }) => {
    const room = playersInSnakeRoom[roomId];
    if (!room || room.length >= 2) {
      socket.emit('roomFull'); // Room is full or doesn't exist
      return;
    }

    const roomOwner = room[0]; // Room creator is player 1
    io.to(roomOwner.id).emit('joinRequest', { playerName, socketId: socket.id, roomId }); // Ask the owner to accept/decline
  });

  // Handle room join acceptance
  socket.on('acceptJoin', ({ roomId, socketId, playerName }) => {
    if (!snakeGames[roomId] || playersInSnakeRoom[roomId].length >= 2) {
      io.to(socketId).emit('roomFull'); // If room is now full
      return;
    }

    playersInSnakeRoom[roomId].push({ id: socketId, playerNumber: 2, playerName });
    io.to(socketId).emit('joinAccepted', { roomId, playerNumber: 2 });
    io.to(roomId).emit('snakeStateUpdate', snakeGames[roomId]); // Update both players

    // Update room list and notify all users
    updateRoomStatus(roomId, playersInSnakeRoom[roomId].length);
    io.emit('updateSnakeRooms', availableSnakeRooms);
  });

  // Decline join request
  socket.on('declineJoin', (socketId) => {
    io.to(socketId).emit('joinDeclined');
  });

  // Handle snake movements and game updates
  socket.on('moveSnake', ({ roomId, direction, playerNumber }) => {
    if (snakeGames[roomId]) {
      updateSnakeDirection(roomId, direction, playerNumber, io);
    }
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    cleanUpOnDisconnect(socket, io);
  });
}

// Create the initial game state for a room
function createInitialSnakeState(mode) {
  const initialState = {
    score: 0,
    food: { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) },
    players: [
      { segments: [{ x: 10, y: 10 }], direction: 'right' }, // Player 1's snake
      mode === 'two' ? { segments: [{ x: 15, y: 15 }], direction: 'left' } : null
    ].filter(Boolean) // Only add Player 2 if two-player mode
  };
  return initialState;
}

// Update snake direction based on player input
function updateSnakeDirection(roomId, direction, playerNumber, io) {
  const gameState = snakeGames[roomId];
  const playerIndex = playerNumber - 1;

  if (playerIndex >= 0 && playerIndex < gameState.players.length) {
    gameState.players[playerIndex].direction = direction;
    io.to(roomId).emit('snakeStateUpdate', gameState); // Update game state
  }
}

// Update room status (players: 0, 1, or 2)
function updateRoomStatus(roomId, playerCount) {
  const roomIndex = availableSnakeRooms.findIndex(room => room.roomId === roomId);
  if (roomIndex !== -1) {
    availableSnakeRooms[roomIndex].players = playerCount;
  }
}

// Clean up when a player disconnects
function cleanUpOnDisconnect(socket, io) {
  for (const roomId in playersInSnakeRoom) {
    const players = playersInSnakeRoom[roomId];
    const playerIndex = players.findIndex(player => player.id === socket.id);

    if (playerIndex !== -1) {
      players.splice(playerIndex, 1); // Remove player from room

      if (players.length === 0) {
        delete snakeGames[roomId];
        delete playersInSnakeRoom[roomId];
        availableSnakeRooms = availableSnakeRooms.filter(room => room.roomId !== roomId);
        io.emit('updateSnakeRooms', availableSnakeRooms); // Notify users about room removal
      } else {
        io.to(roomId).emit('opponentDisconnected');
        updateRoomStatus(roomId, players.length);
        io.emit('updateSnakeRooms', availableSnakeRooms); // Notify users about the room update
      }
      break;
    }
  }
}
