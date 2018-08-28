const ENV_ARGS = require('minimist')(process.argv.slice(2));
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = (ENV_ARGS.env_port) ? ENV_ARGS.env_port : 3000;

server.listen(port, () => {
  console.log('Server listening at port', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  socket.on('add user', userName => {
    socket.username = userName;
    socket.emit('login', socket.username)
    socket.broadcast.emit('new user', socket.username)
  })

  socket.on('new message', data => {
    socket.broadcast.emit('new message', data)
  })

  socket.on('disconnect', _ => {
    socket.broadcast.emit('user left', socket.username)
  })
});