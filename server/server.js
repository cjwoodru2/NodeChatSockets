const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

// using join path to point statis to public dir
const publicPath = path.join(__dirname + '/../public');
const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket) => {
   console.log('new user connected'); 
    
    // Welcome all joined users to the chat app
        socket.emit('newMessage', {
            from: 'Admin',
            text: 'Welcome to Woody\'s Socket/Node powered chat app!',
            createdAt: new Date().getTime()
        });
    // Alerts all users that a new user has joined
        socket.broadcast.emit('newMessage', {
            from: 'Admin',
            text: 'A new user has joined',
            createdAt: new Date().getTime()
        });
        
    socket.on('createMessage', (message) => {
       console.log('createMessage', message);

        io.emit('newMessage', {
          from: message.from,
          text: message.text,
          createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
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