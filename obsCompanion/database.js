const Database = require("better-sqlite3");

const db = new Database("viewers.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    points INTEGER
)
`).run();

function addUser(username) {

    const user = db.prepare(`
        SELECT * FROM users WHERE username = ?
    `).get(username);

    if (!user) {

        db.prepare(`
            INSERT INTO users (username, points)
            VALUES (?, 1000)
        `).run(username);

        console.log(username + " añadido con 1000 puntos");
    }
}

module.exports = { db, addUser };