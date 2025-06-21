const request = require('supertest');
const app = require('../src/app'); // Pastikan app diekspor dari src/app.js

describe('Recipe API', () => {
  let token;
  let recipeId;

  beforeAll(async () => {
    // Login untuk mendapatkan token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    token = res.body.token;
  });

  test('Tambah resep baru', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .field('judulResep', 'Test Resep')
      .field('alatBahan', 'Bahan 1, Bahan 2')
      .field('caraMembuat', 'Langkah 1, Langkah 2')
      .field('kategori', 'Makanan Berat');
    expect(res.statusCode).toBe(201);
    expect(res.body.recipe).toHaveProperty('id');
    recipeId = res.body.recipe.id;
  });

  test('Ambil resep berdasarkan ID', async () => {
    const res = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', recipeId);
  });

  test('Update resep', async () => {
    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('judulResep', 'Test Resep Updated')
      .field('alatBahan', 'Bahan 1 Updated')
      .field('caraMembuat', 'Langkah 1 Updated')
      .field('kategori', 'Cemilan / Snack');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Resep berhasil diperbarui!');
  });

  test('Hapus resep', async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Resep berhasil dihapus!');
  });
});
