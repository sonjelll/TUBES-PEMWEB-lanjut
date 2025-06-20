const Favorite = require('../models/favoriteModel');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{ model: Recipe }],
    });
    res.json(favorites.map(fav => fav.Recipe));
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.body.recipeId;
    const existing = await Favorite.findOne({
      where: { user_id: userId, recipe_id: recipeId },
    });
    if (existing) {
      return res.status(400).json({ message: 'Favorite already exists' });
    }
    const favorite = await Favorite.create({ user_id: userId, recipe_id: recipeId });
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    const deleted = await Favorite.destroy({
      where: { user_id: userId, recipe_id: recipeId },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
