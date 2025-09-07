const express = require('express');
const app = express();
const port = 3000;

// Vulnerable endpoint (SQL injection simulation)
app.get('/user', (req, res) => {
  const id = req.query.id;
  res.send(`You requested user id: ${id}`);
});

app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
});
