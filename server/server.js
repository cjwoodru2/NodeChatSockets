const express = require("express");
const path = require("path");

const app = express();

// using join path to point statis to public dir
const publicPath = path.join(__dirname + '/../public');
app.use(express.static(publicPath));


// App listen to start server
app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Chat Server is live!');
});
module.exports = { app };