// frontend/src/db.js
const mysql = require('mysql2/promise'); // Pastikan ini ada

const pool = mysql.createPool({ // Variabel 'pool' dideklarasikan dan diinisialisasi di sini
    host: 'localhost', // Sesuai dengan config kamu
    user: 'root',      // Sesuai dengan config kamu
    password: 'oop',   // Sesuai dengan config kamu
    database: 'food-recipe' // Sesuai dengan config kamu
});

// Test connection (Opsional, tapi disarankan untuk debugging)
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully!');
        connection.release(); // Penting: Lepaskan koneksi kembali ke pool
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool; // Sekarang 'pool' sudah dideklarasikan sebelum diekspor