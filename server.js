const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let chat = {};

app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.sockets.on('connection', (socket) => {
    socket.on('new_user', ({username, room}) => {
        socket.username = username;
        socket.room = room;
        socket.join(room);
        const params = {
            username,
            message: 'a rejoint le Chat !'
        };
        if (chat[room] === undefined) {
            chat[room] = [];
        }
        chat[room].push(params);
        socket.emit('user_init', chat[room]);
        socket.to(room).emit('new_user', username);
    });

    socket.on('message', (message) => {
        const params = {
            username: socket.username,
            message
        };
        chat[socket.room].push(params);
        socket.emit('message', params);
        socket.to(socket.room).emit('message', params);
    });
});

server.listen(8080);