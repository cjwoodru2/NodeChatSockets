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
   
   socket.on('disconnect', (socket) => {
        console.log('user has disconnected')
    })
});



// App listen to start server
server.listen(process.env.PORT, process.env.IP, () => {
    console.log('Chat Server is live!');
});
module.exports = { app };