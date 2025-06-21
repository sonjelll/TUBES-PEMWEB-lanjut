const request = require('supertest');
const app = require('../src/app'); // Pastikan app.js mengekspor app Express

describe('Recipe Controller', () => {
  let token;
  let createdRecipeId;

  beforeAll(async () => {
    // Login atau buat token valid untuk testing
    // Contoh login dan dapatkan token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    token = res.body.token;
  });

  test('should add a new recipe', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .field('judulResep', 'Test Recipe')
      .field('alatBahan', 'Test Ingredients')
      .field('caraMembuat', 'Test Instructions')
      .field('kategori', 'Makanan Berat');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('recipe');
    createdRecipeId = res.body.recipe.id;
  });

  test('should get user recipes', async () => {
    const res = await request(app)
      .get('/api/recipes/mine')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should update a recipe', async () => {
    const res = await request(app)
      .put(`/api/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('judulResep', 'Updated Recipe')
      .field('alatBahan', 'Updated Ingredients')
      .field('caraMembuat', 'Updated Instructions')
      .field('kategori', 'Cemilan / Snack');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Resep berhasil diperbarui!');
  });

  test('should delete a recipe', async () => {
    const res = await request(app)
      .delete(`/api/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Resep berhasil dihapus!');
  });
});
