const express = require('express');
const app = express();
const _ = require('lodash');

app.get('/', (req, res) => {
  // deliberately insecure
  const name = req.query.name || "Guest";
  res.send("Hello " + name); // XSS risk
});

app.listen(3000, () => console.log("App running on http://localhost:3000"));
