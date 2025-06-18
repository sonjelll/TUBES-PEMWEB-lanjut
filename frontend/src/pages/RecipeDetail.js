import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeByIdApi } from "../api/api";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeByIdApi(id);
        setRecipe(data);
      } catch (err) {
        setError("Gagal mengambil data resep.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Resep tidak ditemukan.</p>;

  return (
    <div className="recipe-detail" style={{ maxWidth: 800, margin: "20px auto", padding: 20, boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "#fff", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {recipe.image_url && (
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          style={{ width: "100%", height: "auto", borderRadius: 12, marginBottom: 20, objectFit: "cover", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} 
        />
      )}
      <p style={{ fontStyle: "italic", color: "#666", marginBottom: 10, fontSize: 14 }}>Oleh: {recipe.user_id}</p>
      <h1 style={{ fontSize: "2.8rem", fontWeight: "bold", marginBottom: 25, color: "#ff914d", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>{recipe.title}</h1>
      <section style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: 15, borderBottom: "3px solid #ff914d", paddingBottom: 8, color: "#333" }}>Alat dan Bahan</h2>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: 16, color: "#444" }}>{recipe.ingredients}</p>
      </section>
      <section>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: 15, borderBottom: "3px solid #ff914d", paddingBottom: 8, color: "#333" }}>Cara Membuat</h2>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: 16, color: "#444" }}>{recipe.description}</p>
      </section>
    </div>
  );
};

export default RecipeDetail;
