// db.js
const mysql = require('mysql2');

// create the connection
const db = mysql.createConnection({
  host: 'localhost',          // your MySQL server (usually local)
  user: 'root',               // your MySQL username
  password: '',   // 🔒 replace this with your real MySQL password
  database: 'satellites'      // the database you created earlier
});

// test the connection
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL successfully!');
  }
});

// export it so other files can use this connection
module.exports = db;
