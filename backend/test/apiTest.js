const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function loginAndGetToken(username, password) {
  const response = await fetch(\`\${API_BASE_URL}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  return data.token;
}

async function testFavoritesApi() {
  try {
    // Ganti dengan username dan password valid di database Anda
    const username = 'testuser';
    const password = 'testpassword';

    const token = await loginAndGetToken(username, password);
    console.log('Login successful, token:', token);

    // 1. Get current favorites
    let response = await fetch(\`\${API_BASE_URL}/favorites\`, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    let favorites = await response.json();
    console.log('Current favorites:', favorites);

    // 2. Add a favorite (ganti dengan recipeId valid)
    const recipeIdToAdd = 1; // Pastikan ID resep ini valid di database Anda
    response = await fetch(\`\${API_BASE_URL}/favorites\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeId: recipeIdToAdd })
    });
    const addResult = await response.json();
    console.log('Add favorite result:', addResult);

    // 3. Remove the favorite
    response = await fetch(\`\${API_BASE_URL}/favorites/\${recipeIdToAdd}\`, {
      method: 'DELETE',
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    const removeResult = await response.json();
    console.log('Remove favorite result:', removeResult);

  } catch (error) {
    console.error('API test error:', error);
  }
}

testFavoritesApi();
