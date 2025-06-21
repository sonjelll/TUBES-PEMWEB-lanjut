require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Tambahkan ini
const db = require('./db'); // Pastikan koneksi DB terinisialisasi

const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const Recipe = require('./models/recipeModel');
const User = require('./models/userModel');

const app = express();
const PORT = process.env.PORT || 5000;

// Definisikan relasi model di sini agar Sequelize mengenali asosiasi
User.hasMany(Recipe, { foreignKey: 'user_id' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk memeriksa JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1); // Hentikan server jika JWT_SECRET tidak ada
}

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

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});
