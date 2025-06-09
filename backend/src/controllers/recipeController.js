const db = require('../db');

exports.getAllRecipes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};