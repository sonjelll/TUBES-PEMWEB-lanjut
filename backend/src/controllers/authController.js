const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, nama, email } = req.body;
  // Cek username sudah ada
  const existing = await userModel.findByUsername(username);
  if (existing) return res.status(400).json({ error: 'Username sudah terdaftar' });
  // Cek email sudah ada
  const existingEmail = await userModel.findByEmail(email);
  if (existingEmail) return res.status(400).json({ error: 'Email sudah terdaftar' });
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(username, hash, nama, email);
  res.json(user);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findByUsername(username);
  if (!user) return res.status(400).json({ error: 'User tidak ditemukan' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Password salah' });
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email,
      role: user.role
    }
  });
};