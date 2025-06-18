import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Simulasi API
const dummyRecipes = [
  { id: 1, title: "Tongseng kambing simpel" },
  { id: 2, title: "Ayam Bakar Madu" },
  { id: 3, title: "Sate Padang" },
];

export default function RecipeList({ koleksi, setKoleksi, user }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Ganti dengan fetch/getRecipes() jika ada API
    setRecipes(dummyRecipes);
  }, []);

  function handleBookmark(recipe) {
    if (!koleksi.find(r => r.id === recipe.id)) {
      setKoleksi([...koleksi, recipe]);
    }
  }

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
                title="Simpan ke Koleksi"
              >
                <i
                  className={
                    koleksi.find(k => k.id === r.id)
                      ? "fas fa-bookmark"
                      : "far fa-bookmark"
                  }
                  style={{
                    color: koleksi.find(k => k.id === r.id) ? "#ff914d" : "#888",
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
