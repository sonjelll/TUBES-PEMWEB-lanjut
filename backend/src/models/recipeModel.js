const { DataTypes } = require('sequelize');
const db = require('../../db'); // Mengimport koneksi db dari db.js

const Recipe = db.define('Recipe', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false // Sesuaikan jika user_id bisa null
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: { // Ini untuk caraMembuat/instructions
        type: DataTypes.TEXT,
        allowNull: false
    },
    ingredients: { // Tambahkan kolom ini untuk alatBahan jika belum ada di DB
        type: DataTypes.TEXT,
        allowNull: true // Bisa null jika tidak wajib
    },
    category: { // Tambahkan kolom kategori
        type: DataTypes.STRING(255),
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true // Bisa null jika gambar tidak wajib
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'recipes', // Pastikan nama tabel di DB adalah 'recipes'
    timestamps: false, // Sesuaikan jika kamu menggunakan kolom createdAt/updatedAt otomatis
    underscored: true // Jika kolom di DB menggunakan underscore_case (misal: user_id)
});

// Jika ada tabel User, bisa definisikan relasi di sini
// const User = require('./userModel'); // Misal import model User
// Recipe.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Recipe;