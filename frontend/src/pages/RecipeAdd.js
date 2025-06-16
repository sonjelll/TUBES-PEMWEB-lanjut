import RecipeForm from "../components/RecipeForm";
import { useNavigate } from "react-router-dom";
import { addRecipeApi } from "../api/api"; // Import fungsi API

export default function RecipeAdd() {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    try {
      await addRecipeApi(formData); // Gunakan fungsi API
      alert("Resep berhasil ditambahkan!");
      navigate("/resep-saya");
    } catch (error) {
      console.error("Gagal menambahkan resep:", error);
      alert("Gagal menambahkan resep. Silakan coba lagi. " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h1 className="title" style={{ marginBottom: 20, textAlign: "center" }}>Tambah Resep Baru</h1>
      <RecipeForm onAdd={handleAdd} />
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button className="button is-light" onClick={() => navigate(-1)}>
          Kembali
        </button>
      </div>
    </div>
  );
}