const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));

