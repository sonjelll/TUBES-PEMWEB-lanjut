const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // Assuming you have a user model

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Kesalahan server internal (JWT Secret missing)' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Optional: Fetch user from DB to ensure they still exist/are valid
        // const user = await userModel.findById(decoded.id);
        // if (!user) {
        //     return res.status(401).json({ message: 'User tidak ditemukan.' });
        // }
        req.user = decoded; // Add decoded user payload to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};

module.exports = authMiddleware;
