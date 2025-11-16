'use strict';

const title = document.querySelector('.header h1'),
    consoleLog = document.querySelector('.console-log'),
    chat = document.querySelector('.chat'),
    version = '0.02',
    socket = io();

title.textContent = `OBS Companion ${version}`;

socket.on('chat-message', (data) => {

    if( data.message.startsWith('!') || data.message.startsWith('#') ) {
        
    } else {

        let newMessage = document.createElement('div'),
            user = data.user.replace('/\W/g, "_"');

        newMessage.classList.add('message');
        newMessage.innerHTML += `<span class='${ user }'> ${ user } </span> ${ data.message }`;
        chat.appendChild(newMessage);
        chat.scrollTop = chat.scrollHeight;

    }

})