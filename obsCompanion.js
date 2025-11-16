// web.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const tmi = require('tmi.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3002; // puedes usar otro puerto si quieres

// Servir archivos estáticos (HTML, JS)
app.use(express.static('obsCompanion'));

// tmi.js client
const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [ process.env.CHANNEL ]
});

client.connect().catch(console.error);

// Escucha chat y envía al cliente web
client.on('message', (channel, tags, message, self) => {
    if (self) return;
    io.emit('chat-message', { user: tags['display-name'] || tags.username, message });
});

// Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado a la web');

    // Cuando el cliente envía un mensaje para chat
    socket.on('send-message', (msg) => {
        client.say(process.env.CHANNEL, msg);
    });

    // Puedes agregar más eventos para testear variables
    socket.on('test-var', (data) => {
        console.log('Variable enviada desde web:', data);
    });
});

server.listen(PORT, () => {
    console.log(`Web interface corriendo en http://localhost:${PORT}`);
});
