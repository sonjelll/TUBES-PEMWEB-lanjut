import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllRecipesApi } from "../api/api";

export default function RecipeList({ user, favorites, onBookmark }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipesApi();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  const isFavorite = (recipeId) => {
    return favorites && favorites.some(fav => fav.id === recipeId);
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
                onClick={() => onBookmark(r)}
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
