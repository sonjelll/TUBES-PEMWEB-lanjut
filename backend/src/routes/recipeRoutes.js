const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');
const path = require('path');
// const authMiddleware = require('../middleware/authMiddleware'); // Jika kamu punya middleware auth

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Path relatif dari root backend
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route untuk menambah resep baru (membutuhkan upload file)
// Gunakan middleware upload.single() sebelum controller
router.post('/', upload.single('gambarResep'), /* authMiddleware, */ recipeController.addRecipe);

// Route untuk mendapatkan semua resep
router.get('/', recipeController.getAllRecipes);

// Route untuk mendapatkan resep populer
router.get('/popular', recipeController.getPopularRecipes);

// Route untuk mendapatkan resep berdasarkan kategori
router.get('/category/:categoryName', recipeController.getRecipesByCategory);

// Route untuk mendapatkan resep milik pengguna (user_id harusnya dari auth, bukan params)
router.get('/mine/:userId', recipeController.getUserRecipes);


module.exports = router;