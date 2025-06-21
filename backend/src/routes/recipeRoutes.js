const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware'); // Jika kamu punya middleware auth

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route untuk menambah resep baru (membutuhkan upload file dan autentikasi)
router.post('/', authMiddleware, upload.single('gambarResep'), recipeController.addRecipe);

// Route untuk mendapatkan semua resep
router.get('/', recipeController.getAllRecipes);

// Route untuk mendapatkan resep populer
router.get('/popular', recipeController.getPopularRecipes);

// Route untuk mendapatkan resep berdasarkan kategori
router.get('/category/:categoryName', recipeController.getRecipesByCategory);

// Route untuk mendapatkan resep milik pengguna (user_id harusnya dari auth, bukan params)
router.get('/mine', authMiddleware, recipeController.getUserRecipes);

// Route untuk mendapatkan detail resep berdasarkan ID (untuk Edit)
router.get('/:id', recipeController.getRecipeById);

// Middleware logging sederhana untuk route update resep
const logUpdateRecipeRequest = (req, res, next) => {
  console.log(`Request update resep diterima: user=${req.user ? req.user.id : 'unknown'}, recipeId=${req.params.id}`);
  next();
};

// Route untuk mengupdate resep (butuh upload file dan autentikasi)
router.put('/:id', authMiddleware, logUpdateRecipeRequest, multer({ storage: multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
}) }).single('gambarResep'), recipeController.updateRecipe);

// Route untuk menghapus resep (butuh autentikasi)
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router;
