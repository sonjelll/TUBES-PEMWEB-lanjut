const mysql = require('mysql2/promise');

module.exports = pool;const pool = mysql.createPool({
  host: 'localhost', // Biasanya 'localhost' jika database di mesin yang sama
  user: 'root',      // User MySQL Anda
  password: 'oop',   // Password MySQL Anda
  database: 'food-recipe' // Nama database Anda
});
