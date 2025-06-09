const API_URL = 'http://localhost:5000/api';

export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

// Tambahkan fungsi lain: addRecipe, updateRecipe, deleteRecipe, login, dsb.