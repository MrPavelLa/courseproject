const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5007;

mongoose.connect('mongodb://localhost:27017/WLT', {});

app.use(cors());
app.use(express.json());
app.use('/comments', commentRoutes);

const socket = io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('commentUpdated', () => {
    io.emit('commentsUpdated');
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
