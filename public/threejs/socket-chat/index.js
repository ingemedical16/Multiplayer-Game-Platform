import express from 'express'
import http from 'http'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const  app = express()
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });


  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });
  const hostname = '127.0.0.1';
  const port = 3000;
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

