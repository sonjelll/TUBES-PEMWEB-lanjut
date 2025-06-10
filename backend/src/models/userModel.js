const db = require('../db');

// Cari user berdasarkan username
exports.findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

// Cari user berdasarkan email
exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Tambah user baru (register)
exports.createUser = async (username, password, nama, email, role = 'user') => {
  const [result] = await db.query(
    'INSERT INTO users (username, password, nama, email, role) VALUES (?, ?, ?, ?, ?)',
    [username, password, nama, email, role]
  );
  return { id: result.insertId, username, nama, email, role };
};