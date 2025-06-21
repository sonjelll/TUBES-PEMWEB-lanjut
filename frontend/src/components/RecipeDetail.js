import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getRecipeByIdApi } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function RecipeDetail({ user, favorites, onBookmark }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await getRecipeByIdApi(id);
      setRecipe(data);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };

  const isFavorite = () => {
    return favorites && favorites.some(fav => fav.id === recipe?.id);
  };

  const handleBookmark = () => {
    if (recipe) {
      onBookmark(recipe);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      {user && (
        <button
          onClick={handleBookmark}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontSize: 24,
            color: isFavorite() ? "#ff914d" : "#888"
          }}
          title={isFavorite() ? "Hapus dari Koleksi" : "Simpan ke Koleksi"}
        >
          <i className={isFavorite() ? "fas fa-bookmark" : "far fa-bookmark"}></i>
        </button>
      )}
    </div>
  );
}
