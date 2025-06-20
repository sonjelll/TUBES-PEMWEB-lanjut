require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Tambahkan ini
const db = require('./db'); // Pastikan koneksi DB terinisialisasi

const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan folder 'uploads' secara statis agar gambar bisa diakses dari frontend
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); // Koreksi path ke d:\PEMWEB-TUBES\backend\uploads

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
// Aktifkan route auth agar login dan register bisa diakses
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('Cook.io Backend API is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});