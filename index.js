const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (nickname) => {
    socket.nickname = nickname;
    io.emit('user connected', `${nickname} has connected`);
  });

  socket.on('message', (msg) => {
    io.emit('message', { nickname: socket.nickname, message: msg });
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      io.emit('user disconnected', `${socket.nickname} has disconnected`);
    }
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
