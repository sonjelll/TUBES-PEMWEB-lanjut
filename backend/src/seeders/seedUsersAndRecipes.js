const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

async function seed() {
  try {
    // Seed users
    await User.bulkCreate([
      { username: 'user1', password: 'password1', nama: 'User One' },
      { username: 'user2', password: 'password2', nama: 'User Two' },
    ], { ignoreDuplicates: true });

    // Seed recipes
    await Recipe.bulkCreate([
      {
        user_id: 1,
        title: 'Tongseng kambing simpel',
        ingredients: 'Daging kambing, bumbu',
        description: 'Cara membuat tongseng kambing simpel',
        category: 'makanan berat',
        image_url: null,
      },
      {
        user_id: 2,
        title: 'Ayam Bakar Madu',
        ingredients: 'Ayam, madu, bumbu',
        description: 'Cara membuat ayam bakar madu',
        category: 'makanan berat',
        image_url: null,
      },
      {
        user_id: 1,
        title: 'Sate Padang',
        ingredients: 'Daging sapi, bumbu sate',
        description: 'Cara membuat sate padang',
        category: 'cemilan',
        image_url: null,
      },
    ], { ignoreDuplicates: true });

    console.log('Seed data berhasil ditambahkan.');
  } catch (error) {
    console.error('Error saat menambahkan seed data:', error);
  }
}

seed();
