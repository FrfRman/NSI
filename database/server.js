const express = require('express');
const db = require('./db');
const app = express();

app.get('/satellites', (req, res) => {
  db.query("SELECT * FROM satellites_data LIMIT 100", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(3000, () => console.log("🌍 Server running at http://localhost:3000"));
