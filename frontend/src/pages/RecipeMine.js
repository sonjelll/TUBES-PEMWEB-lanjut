import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRecipesApi, deleteRecipeApi } from "../api/api"; // Import fungsi API

export default function RecipeMine() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Untuk userId, idealnya diambil dari konteks user yang login
  // Untuk sementara, kita bisa hardcode atau ambil dari localStorage jika user ID tersimpan di sana
  const dummyUserId = 1; // Ganti dengan ID user asli yang login

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const data = await getUserRecipesApi(dummyUserId); // Gunakan fungsi API
      setMyRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch my recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [dummyUserId]); // Dependensi dummyUserId jika berubah (misal dari context)

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus resep ini?")) return;
    try {
      await deleteRecipeApi(id);
      alert("Resep berhasil dihapus");
      fetchMyRecipes(); // Refresh data setelah hapus
    } catch (err) {
      alert("Gagal menghapus resep: " + err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-resep/${id}`);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Memuat resep...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h1 className="title" style={{ marginBottom: 20, textAlign: "center" }}>Resep Saya</h1>
      {myRecipes.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Kamu belum memiliki resep. Ayo buat yang pertama!</p>
      ) : (
        <div className="columns is-multiline">
          {myRecipes.map((recipe) => (
            <div className="column is-4" key={recipe.id}> {/* Gunakan recipe.id dari DB */}
              <div className="card">
                {recipe.image_url && (
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={recipe.image_url} alt={recipe.title} style={{ objectFit: "cover" }} />
                    </figure>
                  </div>
                )}
                <div className="card-content">
                  <p className="title is-5">{recipe.title}</p>
                  {/* Jika kamu menyimpan namaPembuat di DB (misal dari JOIN ke tabel users) */}
                  {/* <p className="subtitle is-6">Oleh: {recipe.namaPembuat}</p> */}
                  <div className="content">
                    <strong>Alat & Bahan:</strong>
                    <p>{recipe.ingredients}</p> {/* Asumsi kolom 'ingredients' di DB */}
                    <strong>Cara Membuat:</strong>
                    <p>{recipe.description}</p> {/* Asumsi kolom 'description' di DB untuk cara membuat */}
                  </div>
                  <div className="buttons is-right">
                    <button className="button is-info" onClick={() => handleEdit(recipe.id)}>Edit</button>
                    <button className="button is-danger" onClick={() => handleDelete(recipe.id)}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
