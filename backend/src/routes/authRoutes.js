const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordController = require('../controllers/passwordController');

// Route untuk register (daftar)
router.post('/register', authController.register);

// Route untuk login
router.post('/login', authController.login);

// Route untuk reset password
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;
