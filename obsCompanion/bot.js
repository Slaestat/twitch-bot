const tmi = require("tmi.js");
const { addUser } = require("./database");

const client = new tmi.Client({
    connection: { reconnect: true },
    channels: ["slaestat"]
});

client.connect();

client.on("message", (channel, tags, message, self) => {

    if (self) return;

    const username = tags.username;

    addUser(username);

});