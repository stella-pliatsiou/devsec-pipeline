const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // για SQL Injection demo

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Hardcoded password (για TruffleHog demo)
const adminPassword = "SuperSecret123!";

// MySQL connection (demo, δεν τρέχει πραγματικά)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testdb'
});

// SQL Injection vulnerable route
app.get('/user', (req, res) => {
  const id = req.query.id;
  const query = `SELECT * FROM users WHERE id = '${id}'`; 
  connection.query(query, (err, results) => {
    if(err) return res.status(500).send(err);
    res.send(results);
  });
});

// XSS vulnerable route
app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Hello ${name}</h1>`); // Τρωτό
});

app.listen(3000, () => console.log('Server running on port 3000'));
