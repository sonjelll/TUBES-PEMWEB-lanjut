const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all favorite routes with authentication middleware
router.use(authMiddleware);

// GET /api/favorites - get all favorites for logged-in user
router.get('/', favoriteController.getFavorites);

// POST /api/favorites - add a favorite
router.post('/', favoriteController.addFavorite);

// DELETE /api/favorites/:recipeId - remove a favorite
router.delete('/:recipeId', favoriteController.removeFavorite);

module.exports = router;
