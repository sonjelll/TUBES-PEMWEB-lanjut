const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // Assuming you have a user model

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log('Auth Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Token tidak disediakan atau format salah');
        return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Kesalahan server internal (JWT Secret missing)' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Pastikan id adalah number agar sesuai tipe user_id di DB
        if (decoded && decoded.id) {
            decoded.id = Number(decoded.id);
        }
        req.user = decoded; // Add decoded user payload to request object
        next();
    } catch (error) {
        console.log('Token tidak valid:', error.message);
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};

module.exports = authMiddleware;
