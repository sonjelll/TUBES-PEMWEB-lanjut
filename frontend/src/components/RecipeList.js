import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavoritesApi, addFavoriteApi, removeFavoriteApi } from "../api/api";

// Simulasi API
const dummyRecipes = [
  { id: 1, title: "Tongseng kambing simpel" },
  { id: 2, title: "Ayam Bakar Madu" },
  { id: 3, title: "Sate Padang" },
];

export default function RecipeList({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Ganti dengan fetch/getRecipes() jika ada API
    setRecipes(dummyRecipes);

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const favs = await getFavoritesApi();
      setFavorites(favs);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleBookmark = async (recipe) => {
    if (!favorites.find(fav => fav.id === recipe.id)) {
      try {
        await addFavoriteApi(recipe.id);
        setFavorites([...favorites, recipe]);
      } catch (error) {
        console.error("Failed to add favorite:", error);
      }
    } else {
      try {
        await removeFavoriteApi(recipe.id);
        setFavorites(favorites.filter(fav => fav.id !== recipe.id));
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return (
    <div>
      <h2>Daftar Resep</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipes.map(r => (
          <li key={r.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 10,
            background: "#fff"
          }}>
            <Link to={`/recipe-detail/${r.id}`} style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }} onClick={(e) => e.stopPropagation()}>
              {r.title}
            </Link>
            {user && (
              <button
                onClick={() => handleBookmark(r)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0
                }}
                title={isFavorite(r.id) ? "Hapus dari Koleksi" : "Simpan ke Koleksi"}
              >
                <i
                  className={
                    isFavorite(r.id)
                      ? "fas fa-bookmark"
                      : "far fa-bookmark"
                  }
                  style={{
                    color: isFavorite(r.id) ? "#ff914d" : "#888",
                    fontSize: 22
                  }}
                ></i>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
