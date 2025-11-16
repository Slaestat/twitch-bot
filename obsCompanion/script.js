'use strict';

const title = document.querySelector('.header h1'),
    consoleLog = document.querySelector('.console-log'),
    chat = document.querySelector('.chat'),
    version = '0.01',
    socket = io();

title.textContent = `OBS Companion ${version}`;

socket.on('chat-message', (data) => {

    if( data.message.startsWith('!') || data.message.startsWith('#') ) {
        
    } else {
        chat.innerHTML += `<span class='${ data.user }'> ${ data.user } </span> ${ data.message } <br />`;
    }

})