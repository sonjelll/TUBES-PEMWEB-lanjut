import { useEffect, useState } from "react";
import "./App.css";
import "bulma/css/bulma.min.css";
import Navbar from "./components/Navbar";
import { useNavigate, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardUser from "./pages/DashboardUser";
import RecipeList from "./components/RecipeList";
import RecipeAdd from "./pages/RecipeAdd";
import RecipeMine from "./pages/RecipeMine";

// Import fungsi API
import { 
  getAllRecipesApi, 
  getPopularRecipesApi, 
  getRecipesByCategoryApi 
} from "./api/api"; 

function App() {
  const [recipes, setRecipes] = useState([]); // Ini akan jadi semua resep (mungkin tidak perlu jika semua sudah dikategorikan)
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [minumanRecipes, setMinumanRecipes] = useState([]);
  const [kueRecipes, setKueRecipes] = useState([]);

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [koleksi, setKoleksi] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch semua resep (jika diperlukan untuk pencarian global)
    getAllRecipesApi()
      .then(data => setRecipes(data))
      .catch(err => console.error("Error fetching all recipes:", err));

    // Fetch resep populer
    getPopularRecipesApi()
      .then(data => setPopularRecipes(data))
      .catch(err => console.error("Error fetching popular recipes:", err));

    // Fetch resep minuman (Kamu perlu menambahkan kolom 'category' di DB dan mengassign kategori saat tambah resep)
    getRecipesByCategoryApi("Minuman") // Ganti "Minuman" dengan kategori yang sesuai di DB
      .then(data => setMinumanRecipes(data))
      .catch(err => console.error("Error fetching minuman recipes:", err));

    // Fetch resep kue (Kamu perlu menambahkan kolom 'category' di DB dan mengassign kategori saat tambah resep)
    getRecipesByCategoryApi("Kue") // Ganti "Kue" dengan kategori yang sesuai di DB
      .then(data => setKueRecipes(data))
      .catch(err => console.error("Error fetching kue recipes:", err));

  }, []);

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleBookmark(recipe) {
    // bookmark logic, pastikan recipe.id cocok dengan id dari DB
    if (!koleksi.find(r => r.id === recipe.id)) {
      setKoleksi([...koleksi, recipe]);
    }
  }

  const Sidebar = () => (
    <aside className="menu sidebar-custom">
      <div className="has-text-centered" style={{ marginBottom: 32 }}>
        <img src="https://img.icons8.com/fluency/48/chef-hat.png" alt="logo" style={{ width: 32, marginBottom: 8 }} />
        <div style={{ fontWeight: 700, fontSize: 28, color: "#4d2600", marginTop: 8 }}>cook.io</div>
      </div>
      <ul className="menu-list">
        <li>
          <a className="is-active sidebar-active">
            <span className="icon" style={{ color: "#ff914d" }}><i className="fas fa-search"></i></span>
            <span style={{ color: "#ff914d", fontWeight: 600, marginLeft: 8 }}>Cari</span>
          </a>
        </li>
        <li>
          <a>
            <span className="icon"><i className="fas fa-crown"></i></span>
            <span style={{ marginLeft: 8 }}>Premium</span>
          </a>
        </li>
        {user && (
          <>
            <li>
              <a onClick={() => navigate("/tambah-resep")}>
                <span className="icon"><i className="fas fa-plus-circle"></i></span>
                <span style={{ marginLeft: 8 }}>Tambah Resep</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate("/resep-saya")}>
                <span className="icon"><i className="fas fa-user"></i></span>
                <span style={{ marginLeft: 8 }}>Resep Saya</span>
              </a>
            </li>
          </>
        )}
        <li>
          <a>
            <span className="icon"><i className="fas fa-bookmark"></i></span>
            <span style={{ marginLeft: 8 }}>Koleksi Resep</span>
          </a>
          {user && (
            <ul style={{ marginLeft: 24, marginTop: 8 }}>
              <li>
                <a>
                  <span className="icon"><i className="fas fa-book"></i></span>
                  <span style={{ marginLeft: 8 }}>Semua</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>{koleksi.length} Resep</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="icon"><i className="fas fa-bookmark"></i></span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>{koleksi.length} Resep</span>
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
      {!user && (
        <div style={{ marginTop: 32, fontSize: 14, color: "#444" }}>
          Untuk mulai membuat koleksi resep, silakan
          <button type="button" className="link-button" onClick={() => navigate("/login")}>masuk</button>
          atau 
          <button type="button" className="link-button" onClick={() => navigate("/register")}>daftar</button>
        </div>
      )}
    </aside>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onSuccess={user => {
              setUser(user);
              navigate("/");
            }}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            onSuccess={user => {
              setUser(user);
              navigate("/dashboard");
            }}
          />
        }
      />
      {user && (
        <Route path="/dashboard" element={<DashboardUser user={user} />} />
      )}
      <Route
        path="/recipes"
        element={
          <RecipeList
            user={user}
            koleksi={koleksi}
            onBookmark={handleBookmark}
          />
        }
      />
      <Route path="/tambah-resep" element={<RecipeAdd />} />
      <Route path="/resep-saya" element={<RecipeMine />} />

      <Route
        path="*"
        element={
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ marginLeft: 220, flex: 1 }}>
              <Navbar
                onLoginClick={() => navigate("/login")}
                user={user}
                onLogout={() => {
                  setUser(null);
                  localStorage.removeItem("token");
                }}
              />

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
                    {/* Gunakan popularRecipes dari fetch backend */}
                    {popularRecipes.map((item, i) => (
                      <div className="column is-3" key={item.id || i}>
                        <div className="populer-card" style={{ position: "relative" }}>
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="populer-img"
                          />
                          <div className="populer-title">
                            {item.title}
                          </div>
                          {user && (
                            <button
                              onClick={() => handleBookmark(item)}
                              style={{
                                position: "absolute",
                                bottom: 12,
                                right: 12,
                                background: "rgba(255,255,255,0.8)",
                                border: "none",
                                borderRadius: "50%",
                                padding: 6,
                                cursor: "pointer"
                              }}
                              title="Simpan ke Koleksi"
                            >
                              <i
                                className={
                                  koleksi.find(k => k.id === item.id)
                                    ? "fas fa-bookmark"
                                    : "far fa-bookmark"
                                }
                                style={{
                                  color: koleksi.find(k => k.id === item.id) ? "#ff914d" : "#888",
                                  fontSize: 22
                                }}
                              ></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Grid Minuman */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Minuman
                  </h2>
                  <div className="columns is-multiline">
                    {minumanRecipes.map((item, i) => (
                      <div className="column is-3" key={item.id || i}>
                        <div className="populer-card">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="populer-img"
                          />
                          <div className="populer-title">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Grid Kue */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Kue
                  </h2>
                  <div className="columns is-multiline">
                    {kueRecipes.map((item, i) => (
                      <div className="column is-3" key={item.id || i}>
                        <div className="populer-card">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="populer-img"
                          />
                          <div className="populer-title">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;