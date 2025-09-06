// index.js
require('dotenv').config();
const tmi = require('tmi.js');
const { Pool } = require('pg');

const BOT_USERNAME = process.env.BOT_USERNAME;
const OAUTH_TOKEN = process.env.OAUTH_TOKEN; // debe tener prefijo 'oauth:'
const CHANNEL = process.env.CHANNEL; // e.g. '#mi_canal' o 'mi_canal'
const DATABASE_URL = process.env.DATABASE_URL;

// Postgres pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // descomenta si tu host lo requiere
});

// Crea tabla si no existe
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS points (
      username TEXT PRIMARY KEY,
      points INTEGER DEFAULT 0
    );
  `);
}
initDb().catch(console.error);

// tmi.js client
const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [ CHANNEL ]
});

client.connect().catch(console.error);

client.on('connected', (addr, port) => {
  console.log(`Conectado a ${addr}:${port}`);
});

client.on('message', async (channel, tags, message, self) => {
  if (self) return; // ignora mensajes del bot

  const username = tags['display-name'] || tags.username;
  if (!message.startsWith('!')) return;

  const args = message.slice(1).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'points') {
    const pts = await getPoints(username);
    client.say(channel, `@${username}, tienes ${pts} puntos.`);
  }

  if (cmd === 'addpoints') {
    // solo mods/broadcaster
    const isMod = tags.mod || tags.badges?.broadcaster === '1';
    if (!isMod) {
      client.say(channel, `@${username} solo mods/owner pueden usar ese cmd.`);
      return;
    }
    const target = (args[0] || username).replace('@','');
    const amount = parseInt(args[1] || '1', 10);
    if (Number.isNaN(amount)) return client.say(channel, 'Cantidad inválida.');

    await addPoints(target, amount);
    client.say(channel, `Se añadieron ${amount} puntos a ${target}.`);
  }
});

// DB helpers
async function getPoints(username) {
  const res = await pool.query('SELECT points FROM points WHERE username = $1', [username]);
  return res.rowCount ? res.rows[0].points : 0;
}

async function addPoints(username, amount) {
  const res = await pool.query(`
    INSERT INTO points (username, points)
    VALUES ($1, $2)
    ON CONFLICT (username) DO UPDATE SET points = points + EXCLUDED.points
    RETURNING points
  `, [username, amount]);
  return res.rows[0].points;
}
