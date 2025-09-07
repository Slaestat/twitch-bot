let calabozo_player = {};

let calabozo_class = {
    'warrior' : {
        damage : 300,
        mana : 100,
        health : 100,
        resistance : .1,
        init_weapon: 'wooden sword'
    },
    'spellcaster' : {
        damage : 100,
        mana : 300,
        health : 150,
        resistance : .05,
        init_weapon: 'basic wand'
    },
    'beast' : {
        damage : 500,
        mana : 20,
        health : 200,
        resistance : .08,
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
let calabozo_enemies = {
        'wild dog' : {
            health : 150,
            damage: 30,
            evade: .1,
            exp : 5,
            effect : '',
            type : "minor",
            weakness : ['kinetic']
        },
        'crow' : {
            health : 200,
            damage: 20,
            evade: .25,
            exp : 5,
            effect : '',
            type : "minor",
            weakness : ['kinetic']
        },
        'snake' : {
            health : 100,
            damage: 10,
            evade: 0,
            exp : 5,
            effect : 'poison',
            type : "minor",
            weakness : ['kinetic']
        },
        'HiveMindBot: scout' : {
            health : 1000,
            damage: 100,
            evade: .3,
            exp : 50,
            effect : '',
            type : "major",
            weakness : ['water']
        },
        'HiveMindBot: berserker' : {
            health : 1250,
            damage: 150,
            evade: .4,
            exp : 75,
            effect : '',
            type : "major",
            weakness : ['water']
        },
        'HiveMindBot: CoreMind' : {
            health : 3000,
            damage: 500,
            evade: .5,
            exp : 200,
            effect : '',
            type : "boss",
            weakness : []
        }
    };
let pelea_activa = false,
    monster_active = '';




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
        weapon : init_weapon( pickedClass ),
        damage : calabozo_class[ pickedClass ].damage,
        resistance : calabozo_class[ pickedClass ].resistance,
        abilities : []
    }
}

function calabozoPelea( userName, enemyName) {
    let enemy = calabozo_enemies[enemyName],
        user = calabozo_player[ userName ],
        userDamage = user.damage * calabozo_arma[ user.weapon ].damage;

    if ( enemy.weakness.includes( calabozo_arma[ user.weapon ].element ) ) {
        userDamage *= 3;
    }

    pelea_activa = false;
    addLog(`${userName} acepto la pelea`);
    socket.emit('send-message', `${userName} acepto la pelea`);
    
    while( user.health > 0 && enemy.health > 0 ) {
        if ( ( Math.random() * 10 ) > ( Math.random() * 10 ) ) {
            console.log(`evade stat enemy: ${enemy.evade}`);
            if ( Math.random() > enemy.evade ) {
                enemy.health -= userDamage;
                addLog(`${userName} hits ${enemyName}`);
            } else {
                addLog(`${userName} miss ${enemyName}`);
            }
        } else {
            console.log(`evade stat user: ${user.resistance}`);
            if ( Math.random() > user.resistance ) {
                user.health -= enemy.damage;
                addLog(`${enemyName} hits ${userName}`);
            } else {
                addLog(`${userName} parried ${enemyName}`);
            }
        }
    }

    if( user.health <= 0 && enemy.health <= 0 ){
        socket.emit( 'send-message', `DOUBLE K.O. ${userName} y ${enemyName} perecieron en batalla` );
        addLog( `DOUBLE K.O. ${userName} & ${enemyName} both died` );
        monster_active = '';
        pelea_activa = false;
    } else if ( user.health <= 0 ) {
        socket.emit( 'send-message', `${userName} died.` );
        addLog( `${userName} died.` );
        monster_active = '';
        pelea_activa = false;
        delete user;
    } else if ( enemy.health <= 0 ) {
        socket.emit( 'send-message', `${userName} slayed ${enemyName}.` );
        addLog( `${userName} slayed ${enemyName}.` );
        monster_active = '';
        pelea_activa = false;
    }
}

function spawnEnemy( type ) {
    const filteredEnemies = Object.keys(calabozo_enemies).filter(enemyKey => calabozo_enemies[enemyKey].type === type )
        enemies = Object.keys( calabozo_enemies ),
        randomIndex = Math.floor( Math.random() * filteredEnemies.length ),
        randomEnemyKey = filteredEnemies[randomIndex],
        enemy = calabozo_enemies[randomEnemyKey];

    pelea_activa = true;
    monster_active = randomEnemyKey;

    addLog(`Un ${randomEnemyKey} aparecio en chat`);
    socket.emit('send-message', `Un ${randomEnemyKey} aparecio en chat`);

}