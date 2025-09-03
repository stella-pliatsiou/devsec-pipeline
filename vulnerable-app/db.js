const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Create users table
db.serialize(() => {
    db.run("CREATE TABLE users (id INT, name TEXT)");
    db.run("INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob')");
});

module.exports = db;
