// app.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8300;

app.use(cors());

const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// io.origins(['https://jsramverk.fridasaralinnea.me:443']);

const io = require('socket.io')(server, {
    cors: {
        origin: 'https://jsramverk.fridasaralinnea.me:443',
        // origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
    }
    // allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader);
    // }
});



io.on('connection', function (socket) {
    console.info("User connected");

    socket.on('chat message', function (message) {
        io.emit('chat message', message);
    });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
