const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// export user
const {
  joinUser,
  userLeave,
} = require("./utils/users");

// use static
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {

  // join the room
  socket.on('join room', ({ room, username }) => {

    //save user
    const user = joinUser(socket.id, username, room);
    socket.join(user.room)

    // send join msg massage
    io.to(user.room).emit('user joined', user.username);

    // send msg to room
    socket.on('chat message', ({ username, msg }) => {
      io.to(room).emit('chat message', { username, msg });
    });
  })

  // leave user
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('user left' , user.username )
    }
  })


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});