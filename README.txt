# Twitch Bot Web Interface

This project is a local Twitch bot + web interface for testing chat interactions, points, and simple games.  

It is designed for experimentation and learning. You can see chat messages, assign points to users, and send messages to Twitch chat.

---

## Prerequisites

- [Node.js](https://nodejs.org/) installed (v14+ recommended)
- A Twitch account
- A Twitch Developer App for your bot: [Twitch Developer Console](https://dev.twitch.tv/console/apps)

---

## Setup

1. **Clone the repository:**

git bash:
    git clone git@github.com:Slaestat/twitch-bot.git
    cd twitch-bot

2. **Install dependencies**

git bash:
    npm install

3. **Create .env file**

git bash:
    cp .env.example .env

Edit .env and fill in your own Twitch credentials: ( I used my twitch user as a the channel and bot ):

    CLIENT_ID=your_client_id_here
    CLIENT_SECRET=your_client_secret_here
    REDIRECT_URI=http://localhost:3000/auth/callback

    BOT_USERNAME=your_bot_username
    CHANNEL=#your_channel_name
    OAUTH_TOKEN=oauth:your_oauth_token_here

Important: Do not share your .env file publicly. It contains sensitive information.

4. **Running the bot**

Start the OAuth server (for Twitch authentication):
git bash:
    node auth-server.js

Visit http://localhost:3000/auth in your browser to authenticate your bot.

Start the web interface:
git bash:
    node web.js

Open your browser at http://localhost:3001 You should see the web dashboard where you can monitor chat messages, points, and everything that I'll be adding.