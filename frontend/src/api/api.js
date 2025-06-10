const API_URL = 'http://localhost:5000/api';

export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

// Fungsi login
export async function login({ username, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

// Fungsi register
export async function register({ username, password, nama, email }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, nama, email }),
  });
  return res.json();
}

// Tambahkan fungsi lain: addRecipe, updateRecipe, deleteRecipe, dsb.