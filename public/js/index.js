            var socket = io();
            
            socket.on('connect', function () {
                console.log('connected to the server - socket!');
                
            });
            
            socket.on('disconnect', function () {
                console.log('disconnected from the server');
            });
            
            socket.on('newMessage', function (message) {
                console.log('New message received', message)
            })