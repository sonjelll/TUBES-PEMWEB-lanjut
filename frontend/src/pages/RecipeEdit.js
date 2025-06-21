import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { getRecipeByIdApi, updateRecipeApi } from "../api/api";

export default function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeByIdApi(id);
        // Mapping data backend ke format yang diharapkan RecipeForm
        const mappedData = {
          namaPembuat: data.nama_pembuat || "User", // Gunakan nama_pembuat dari backend, fallback ke "User"
          judulResep: data.title || "",
          alatBahan: data.ingredients || "",
          caraMembuat: data.description || "",
          kategori: data.category || "",
          image_url: data.image_url || null,
        };
        setInitialData(mappedData);
      } catch (err) {
        setError(err.message);
        console.error("Gagal mengambil data resep:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateRecipeApi(id, formData);
      alert("Resep berhasil diperbarui!");
      navigate("/resep-saya");
    } catch (err) {
      alert("Gagal memperbarui resep: " + err.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Memuat data resep...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h1 className="title" style={{ marginBottom: 20, textAlign: "center" }}>Edit Resep</h1>
      <RecipeForm onAdd={handleUpdate} initialData={initialData} />
    </div>
  );
}
