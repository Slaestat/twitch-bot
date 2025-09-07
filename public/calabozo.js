let calabozo_player = {};

let calabozo_class = {
    'warrior' : {
        damage : 300,
        mana : 100,
        health : 100,
        resistance : 100,
        init_weapon: 'wooden sword'
    },
    'spellcaster' : {
        damage : 100,
        mana : 300,
        health : 150,
        resistance : 50,
        init_weapon: 'basic wand'
    },
    'beast' : {
        damage : 500,
        mana : 20,
        health : 200,
        resistance : 80,
        init_weapon: 'damaged claws'
    } 
};
let calabozo_element = ['kinetic', 'fire', 'water', 'earth', 'wind', 'light', 'dark'];
let calabozo_ability = {};
let calabozo_arma = { 
        'wooden sword' : {
            damage : 1,
            mana : 0,
            element : 'kinetic',
            effect : '',
            class: 'warrior'
        },
        'basic wand' : {
            damage : 1,
            mana : 2,
            element : 'kinetic',
            effect : '',
            class: 'spellcaster'
        },
        'damaged claws' : {
            damage : 1,
            mana : 0,
            element : 'kinetic',
            effect : '',
            class: 'beast'
        }
    };
let calabozo_minor = {
        'wild dog' : {
            health : 30,
            damage: 30,
            evade: 10,
            exp : 5,
            effect: ''
        },
        'crow' : {
            health : 20,
            damage: 20,
            evade: 25,
            exp : 5,
            effect: ''
        },
        'snake' : {
            health : 10,
            damage: 10,
            evade: 0,
            exp : 5,
            effect: 'poison' 
        }
    };
let calabozo_major = {};
let calabozo_boss = {};
let pelea_activa = false;
let enemy_live = '';




function init_weapon( pickedClass ) {
    switch( pickedClass ) {
        case 'warrior':
            return 'wooden sword';
            break;
        case 'spellcaster':
            return 'basic wand';
            break;
        case 'beast':
            return 'damaged claws'
            break;
    }
}

function calabozo_newPlayer( user, pickedClass ){
    calabozo_player[ user ] = {
        name : user,
        level : 1,
        exp : 0,
        class : pickedClass,
        health : calabozo_class[ pickedClass ].health,
        weapon : calabozo_class[ pickedClass ].weapon,
        abilities : []
    }
}

function calabozoPelea( user, enemy) {
    pelea_activa = false;
    addLog(`${user} acepto la pelea`);
    socket.emit('send-message', `${user} acepto la pelea`);

    //if( user.health > 0 && enemy.health > 0 ){ //ESTO DEBERIA DE SER UN FOR
    while( calabozo_player[user].health > 0 && calabozo_minor[enemy].health > 0 ) {
        if ( ( Math.random() * 10 ) > ( Math.random() * 10 ) ){ // user vs enemy luck
            calabozo_minor[enemy].health -= calabozo_player[user].damage;
            addLog(`${user} hits ${enemy}`);
        } else {
            calabozo_player[user].health -= calabozo_minor[enemy].damage;
            addLog(`${enemy} hits ${user}`);
        }
    }

    if( calabozo_player[user].health <= 0 && calabozo_minor[enemy].health <= 0 ){
        console.log('1');
        socket.emit('send-message', `DOUBLE K.O. ${calabozo_player[user]} y ${calabozo_minor[enemy]} perecieron en batalla`);
    } else if ( calabozo_player[user].health <= 0 ) {
        console.log('2');
        socket.emit('send-message', `${calabozo_player[user]} fue abatido.`);
    } else if ( enemy.health <= 0 ) {
        console.log('3');
        socket.emit('send-message', `${calabozo_player[user]} derrotó a ${calabozo_minor[enemy]}.`);
    }
}

function spawnMinor(){
    const enemies = Object.keys( calabozo_minor ),
        randomIndex = Math.floor( Math.random() * enemies.length ),
        randomEnemyKey = enemies[randomIndex],
        enemy = calabozo_minor[randomEnemyKey];

    pelea_activa = true;
    enemy_live = randomEnemyKey;

    addLog(`Un ${randomEnemyKey} aparecio en chat`);
    socket.emit('send-message', `Un ${randomEnemyKey} aparecio en chat`);

}