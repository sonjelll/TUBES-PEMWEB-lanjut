const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'YOUR_USERNAME',
        password: 'YOUR_PASSWORD'
      }),
    });
    const data = await response.json();
    console.log('Login response:', data);
    if (data.token) {
      console.log('Token:', data.token);
    } else {
      console.log('Login failed');
    }
  } catch (error) {
    console.error('Login test error:', error);
  }
}

testLogin();
