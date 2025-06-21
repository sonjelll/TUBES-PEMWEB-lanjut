import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeByIdApi, addFavoriteApi, removeFavoriteApi, getFavoritesApi } from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeByIdApi(id);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    const fetchFavorites = async () => {
      if (user) {
        try {
          const favs = await getFavoritesApi();
          setFavorites(favs);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchRecipe();
    fetchFavorites();
  }, [id, user]);

  function isFavorite(recipeId) {
    return favorites.some(fav => fav.id === recipeId);
  }

  async function toggleFavorite() {
    if (!user) {
      alert('Silakan login untuk menandai favorit.');
      return;
    }
    try {
      if (isFavorite(recipe.id)) {
        await removeFavoriteApi(recipe.id);
        setFavorites(favorites.filter(fav => fav.id !== recipe.id));
      } else {
        await addFavoriteApi(recipe.id);
        setFavorites([...favorites, recipe]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 10 }}>{recipe.title}</h1>
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 20 }}
        />
      )}
      <div style={{ marginBottom: 15 }}>
        <strong>Kategori:</strong> {recipe.category || '-'}
      </div>
      <div style={{ marginBottom: 15 }}>
        <strong>Alat dan Bahan:</strong>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: 5 }}>{recipe.ingredients || '-'}</p>
      </div>
      <div style={{ marginBottom: 15 }}>
        <strong>Cara Membuat:</strong>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: 5 }}>{recipe.description || '-'}</p>
      </div>
      {user && (
        <button
          onClick={toggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isFavorite(recipe.id) ? '#ff914d' : '#888',
            fontSize: 24,
          }}
          title={isFavorite(recipe.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
        </button>
      )}
    </div>
  );
}
 