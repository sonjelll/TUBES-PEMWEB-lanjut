const db = require('../db');

exports.getAllRecipes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO recipes (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url]
    );
    res.json({ id: result.insertId, title, description, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};