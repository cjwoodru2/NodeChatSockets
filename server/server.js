const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

// using join path to point statis to public dir
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const publicPath = path.join(__dirname + '/../public');
const app = express();
const server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));


io.on('connection', (socket) => {
   console.log('new user connected'); 
    
    // Welcome all joined users to the chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Sockets/Node chat app'));
    
    // Alerts all users that a new user has joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined'));
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Valid name and room name are required');
        }
        
        callback();
    });
        
    socket.on('createMessage', (message, callback) => {
       console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
   });
   
   socket.on('createLocationMessage', (coords) => {
       io.emit('newLocationMessage', generateLocationMessage('Location Admin', coords.latitude, coords.longitude));
   });
   
   socket.on('disconnect', (socket) => {
        console.log('user has disconnected');
    });
});



// App listen to start server
server.listen(process.env.PORT, process.env.IP, () => {
    console.log('Chat Server is live!');
});
module.exports = { app };