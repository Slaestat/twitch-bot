'use strict';

const container = document.querySelector('.container'),
    title = document.querySelector('.header h1'),
    consoleLog = document.querySelector('.console-log'),
    chat = document.querySelector('.chat'),
    version = '0.03',
    max_message = 50,
    socket = io();

let transparencyTimer = null;

title.textContent = `OBS Companion ${version}`;

function backTransparency() {
    container.classList.add( 'transparency' );
}

socket.on('chat-message', (data) => {
    console.log( data );

    container.classList.remove( 'transparency' );

    if ( transparencyTimer ) {
        clearTimeout( transparencyTimer );
    }

    transparencyTimer = setTimeout( backTransparency, 10000 );

    if( data.message.startsWith('!') || data.message.startsWith('#') ) {
        
    } else {

        let newMessage = document.createElement('div'),
            user = data.user.replace(/\W/g, "_"),
            roleIcon = '';

        switch ( data.role ) {
            case 'streamer':
                roleIcon = '👑';
                break;
            case 'mod':
                roleIcon = '🎗️';
                break;
            default:
                break;
        }

        newMessage.classList.add('message');
        newMessage.classList.add( data.role );
        newMessage.innerHTML += `<span class='${ user }'> ${ roleIcon } ${ user } </span> ${ data.message }`;
        chat.appendChild(newMessage);
        if (chat.children.length > max_message) {
            chat.removeChild(chat.firstChild);
        }
        chat.scrollTop = chat.scrollHeight;

    }

})

function addLog( message ) {
    consoleLog.innerHTML += `<p> ${message} </p>`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
}