# Multiplayer Game Platform

## Overview
This platform offers two exciting multiplayer games with real-time interaction, built using modern web technologies like Socket.io, Express, and Three.js. The platform includes user authentication and supports real-time chat and game mechanics.

## Games Available:
1. **Blockland (Multiplayer Game)**:

    - Players can move using a visual joystick.
    - Chat with other players by clicking on them to open a message input field.
    - Real-time interactions powered by Socket.io and Three.js for 3D rendering.
2. **Star War (Multiplayer Game)**:

    - Players must enter their name before joining the game.
    - Movement is controlled via the keyboard: ```W``` (Up), ```A``` (Left), ```S``` (Down), ```D``` (Right).
    - Players shoot projectiles at each other; if hit, a player is eliminated, and the attacker's score increases by 1.
## Features
- **Real-time Multiplayer**: All interactions in both games happen in real time using Socket.io.
- **Authentication System**: Users must sign up, log in, and be authenticated to access the games.
    - **Login/Logout/Signup** functionality.
    - **JWT Authentication** for secure access to game rooms.
- **Chat System**: Players can communicate with other players in real time in Blockland.
- **Game Mechanics**:
    - Blockland features a visual joystick for movement.
    - Star War uses keyboard controls (```W```, ```A```, ```S```, ```D```) and projectile-based combat mouse click event.
- **Backend Architecture**: The backend uses Express with a clean code structure, including:
    - Controllers, Routes, Middleware, Models, Utils, Sockets, Public assets.
- **Frontend**: Built with HTML, CSS, and JavaScript, with libraries like Three.js for 3D rendering.
## Technologies Used
**Backend**:
- ***Node.js*** & Express: Web server and API routing.
- ***Socket.io***: Real-time communication for multiplayer game events.
- ***JSON Web Tokens (JWT)***: For secure user authentication and session management.
- ***Bcrypt**: Password hashing for secure user registration.
- ***Passport.js***: Middleware for handling authentication.
- ***Cookie-Parser***: For managing cookies in user sessions.
- ***CORS***: Handling cross-origin requests securely.
- ***MongoDB***: Database to store user and game data (user profiles, scores, etc.).
**Frontend**:
- ***HTML, CSS, JavaScript***: Core frontend technologies.
- ***Three.js***: Library for rendering 3D elements in Blockland.
- ***Static Assets***: Images, stylesheets, and JavaScript files stored in the public folder.
Folder Structure

## Folder Structure
```
├── controllers      # Handles business logic for authentication, games, and chats
├── routes           # Defines API endpoints and game routes
├── middleware       # JWT verification, login checks
├── models           # User, Game, and Chat schemas (MongoDB/Mongoose)
├── utils            # Helper functions
├── sockets          # Socket.io event handlers for real-time communication
├── public           # Static files (HTML, CSS, JavaScript) and game assets
├── .env             # Environment variables (JWT secret, DB connection, etc.)

```
## Installation
1. **Clone the repository**:

```
git clone https://github.com/your-repo/multiplayer-game-platform.git
cd multiplayer-game-platform
```
2. **Install dependencies**:


```
npm install
```
3. **Create a ```.env``` file in the root of the project and add the following environment variables**:

```
JWT_SECRET=your_jwt_secret
DB_URL=your_mongo_db_url
```
4. **Start the server**:

```
npm run dev
```
5. Open your browser and go to http://localhost:3000 to access the platform.

## Usage
1. **Authentication**: Players need to sign up and log in to access the games.
2. **Blockland**: Once logged in, join the Blockland game to control your player using the visual joystick and chat with other players.
3. **Star War**: Enter your name, join the game, and move your player using the keyboard to shoot and eliminate other players.
## Future Improvements
- Add more multiplayer games with different mechanics.
- Implement global leaderboards and player achievements.
- Enhance the chat functionality with private messaging and more features.
## License
This project is licensed under the MIT License.