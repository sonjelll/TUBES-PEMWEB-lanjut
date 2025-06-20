const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, nama, email } = req.body;
  // Cek username sudah ada
  const existing = await userModel.findOne({ where: { username } });
  if (existing) return res.status(400).json({ error: 'Username sudah terdaftar' });
  // Cek email sudah ada
  const existingEmail = await userModel.findOne({ where: { email } });
  if (existingEmail) return res.status(400).json({ error: 'Email sudah terdaftar' });
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ username, password: hash, nama, email });
  res.json(user);
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: 'User tidak ditemukan' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Password salah' });
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, nama: user.nama, role: user.role }, // Tambahkan user.nama ke payload token
      process.env.JWT_SECRET
    );
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama, // Koreksi typo
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
