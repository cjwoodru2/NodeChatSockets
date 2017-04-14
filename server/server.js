const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

// using join path to point statis to public dir
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname + '/../public');
const app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));


io.on('connection', (socket) => {
   console.log('new user connected'); 
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Valid name and room name are required');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
         // Welcome all joined users to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Sockets/Node chat app'));
        // Alerts all users that a new user has joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined the room.`));
        
        callback();
    });
        
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
   });
   
   socket.on('createLocationMessage', (coords) => {
       var user = users.getUser(socket.id);
       
       if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));    
       }
   });
   
   socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});



// App listen to start server
server.listen(process.env.PORT, process.env.IP, () => {
    console.log('Chat Server is live!');
});
module.exports = { app };