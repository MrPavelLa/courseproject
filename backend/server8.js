const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5008;

app.use(cors());
app.use(express.json());

const socket = io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('cadr', (data) => {
    io.emit('cadr', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});