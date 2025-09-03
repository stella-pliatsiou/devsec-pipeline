const express = require('express');
const _ = require('lodash');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

// Vulnerable ReDoS example
app.get('/redo', (req, res) => {
    const input = req.query.text || "aaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    // lodash trim vulnerable to ReDoS in version 4.17.4
    const trimmed = _.trim(input);
    res.send(`Trimmed length: ${trimmed.length}`);
});

app.listen(3000, () => console.log('Server running on port 3000'));
