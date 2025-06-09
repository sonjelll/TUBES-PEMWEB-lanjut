import { useEffect, useState } from "react";
import "./App.css";
import "bulma/css/bulma.min.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/recipes")
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  // Filter resep berdasarkan pencarian
  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section ala Cookpad */}
      <section
        className="hero is-medium"
        style={{
          background: "linear-gradient(120deg, #fffbe6 0%, #fff 100%)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          minHeight: "60vh",
        }}
      >
        <div
          className="hero-body"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "16px",
            margin: "32px",
          }}
        >
          <h1
            className="title is-1"
            style={{
              color: "#ff914d",
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Cook.io
          </h1>
          <h2
            className="subtitle is-3"
            style={{
              color: "#222",
              fontWeight: 400,
              marginBottom: 24,
            }}
          >
            Temukan & Bagikan Resep Masakan Rumahan Favoritmu!
          </h2>
          <form
            className="field has-addons"
            style={{ maxWidth: 500, width: "100%", margin: "0 auto" }}
            onSubmit={e => e.preventDefault()}
          >
            <div className="control is-expanded">
              <input
                className="input is-large"
                type="text"
                placeholder="Cari resep (misal: ayam, mie, dessert...)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ borderRadius: "24px 0 0 24px" }}
              />
            </div>
            <div className="control">
              <button className="button is-warning is-large" style={{ borderRadius: "0 24px 24px 0" }}>
                🔍
              </button>
            </div>
          </form>
          <p className="mt-5" style={{ color: "#444", fontSize: 18 }}>
            Jelajahi ribuan resep rumahan, simpan favoritmu, dan bagikan kreasi masakanmu bersama komunitas.
          </p>
        </div>
      </section>

      {/* Grid Resep Populer */}
      <section className="section">
        <div className="container">
          <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
            Pencarian populer
          </h2>
          <div className="columns is-multiline">
            {filteredRecipes.length === 0 && (
              <div className="column is-12 has-text-centered">
                <p>Tidak ada resep ditemukan.</p>
              </div>
            )}
            {filteredRecipes.slice(0, 8).map(r => (
              <div className="column is-3" key={r.id}>
                <div className="populer-card">
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="populer-img"
                    />
                  )}
                  <div className="populer-title">
                    {r.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
