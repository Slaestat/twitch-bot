const mods = []; //aqui ponemos el nombre del streamer y de los mods ( o cualquier user quien quieran tenga acceso a los comandos )

function shoutout( streamer ) {
    socket.emit('send-message', `Den una checada a http://twitch.tv/${ streamer }`);
}