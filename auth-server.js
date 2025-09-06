// auth-server.js
require('dotenv').config();
console.log('CLIENT_ID:', process.env.CLIENT_ID);
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';

// 1) Visit /auth to start the flow
app.get('/auth', (req, res) => {
  const scope = encodeURIComponent('chat:read chat:edit'); // añade más scopes si hace falta
  const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
  res.redirect(url);
});

// 2) Callback: Twitch te devuelve ?code=...
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code in query');

  try {
    const tokenResp = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
      }
    });

    // tokenResp.data => { access_token, refresh_token, expires_in, scope, token_type }
    console.log('TOKEN RESP:', tokenResp.data);

    // Instrucciones: copia access_token y pon como OAUTH_TOKEN in .env -> 'oauth:ACCESS_TOKEN'
    res.send(`OK — copia el access_token y guárdalo en tu .env como OAUTH_TOKEN=oauth:${tokenResp.data.access_token}
    <pre>${JSON.stringify(tokenResp.data, null, 2)}</pre>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error obteniendo token; mira la consola');
  }
});

app.listen(PORT, () => console.log(`Auth server en http://localhost:${PORT} — /auth`));
