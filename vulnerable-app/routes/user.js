const express = require('express');
const router = express.Router();
const db = require('../db');

// Vulnerable SQL query
router.get('/info', (req, res) => {
    const userId = req.query.id; // user input directly concatenated
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Vulnerable Command Injection via eval
router.post('/eval', (req, res) => {
    const code = req.body.code || '';
    try {
        // Dangerous eval
        const result = eval(code);
        res.send(`Result: ${result}`);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
