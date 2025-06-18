import { useEffect, useState } from "react";
import "./App.css";
import "bulma/css/bulma.min.css";
import Navbar from "./components/Navbar";
import { useNavigate, Routes, Route, Link } from "react-router-dom"; // PASTIKAN Link DI-IMPORT
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardUser from "./pages/DashboardUser";
import RecipeList from "./components/RecipeList"; // Pertahankan jika masih digunakan di tempat lain
import RecipeAdd from "./pages/RecipeAdd";
import RecipeMine from "./pages/RecipeMine";
import RecipeEdit from "./pages/RecipeEdit";
import RecipeDetail from "./pages/RecipeDetail";
import Premium from "./pages/Premium"; // IMPORT KOMPONEN PREMIUM BARU

// Import fungsi API
import { 
  // getAllRecipesApi, 
  // getPopularRecipesApi, 
  getRecipesByCategoryApi 
} from "./api/api"; 

function App() {
  // recipes tidak digunakan di komponen ini, jadi kita bisa hapus state ini untuk menghilangkan warning
  // const [recipes, setRecipes] = useState([]); 
  // const [popularRecipes, setPopularRecipes] = useState([]);
  const [makananBeratRecipes, setMakananBeratRecipes] = useState([]);
  const [cemilanRecipes, setCemilanRecipes] = useState([]);
  const [sarapanRecipes, setSarapanRecipes] = useState([]);
  const [makananSehatRecipes, setMakananSehatRecipes] = useState([]);
  const [masakanTradisionalRecipes, setMasakanTradisionalRecipes] = useState([]);
  const [minumanRecipes, setMinumanRecipes] = useState([]);
  const [kueRecipes, setKueRecipes] = useState([]);

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null); // State user untuk status login
  const [koleksi, setKoleksi] = useState([]); // Pastikan koleksi bekerja dengan ID dari DB
  const navigate = useNavigate();

  // EFFECT UNTUK MEMBACA STATUS LOGIN DARI LOCALSTORAGE SAAT APLIKASI DIMUAT
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // EFFECT UNTUK FETCH DATA RESEP DARI BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resep per kategori
        const makananBerat = await getRecipesByCategoryApi("Makanan Berat");
        setMakananBeratRecipes(makananBerat);

        const cemilan = await getRecipesByCategoryApi("Cemilan / Snack");
        setCemilanRecipes(cemilan);

        const sarapan = await getRecipesByCategoryApi("Sarapan");
        setSarapanRecipes(sarapan);

        const makananSehat = await getRecipesByCategoryApi("Makanan Sehat");
        setMakananSehatRecipes(makananSehat);

        const masakanTradisional = await getRecipesByCategoryApi("Masakan Tradisional Indonesia");
        setMasakanTradisionalRecipes(masakanTradisional);

        const minuman = await getRecipesByCategoryApi("Minuman"); 
        setMinumanRecipes(minuman);

        const kue = await getRecipesByCategoryApi("Kue");
        setKueRecipes(kue);

      } catch (err) {
        console.error("Error fetching recipes:", err);
        // Pertimbangkan untuk menampilkan pesan error di UI jika fetch gagal
      }
    };

    fetchData();
  }, []); // [] agar hanya dijalankan sekali saat komponen pertama kali di-mount

  // FILTER RESEP BERDASARKAN INPUT PENCARIAN
  // filteredRecipes akan digunakan di bagian "Pencarian populer" saat ada input search
  // Namun saat ini variabel ini tidak digunakan sehingga menimbulkan warning no-unused-vars
  // Jika tidak digunakan, kita bisa menghapusnya untuk menghilangkan warning
  // Jika ingin digunakan, perlu ditambahkan UI untuk menampilkan hasil pencarian
  // Untuk sementara saya hapus variabel ini agar warning hilang
  // const filteredRecipes = recipes.filter(r =>
  //   r.title.toLowerCase().includes(search.toLowerCase())
  // );

  // FUNGSI UNTUK MENANGANI BOOKMARK (pastikan ID resep dari DB)
  function handleBookmark(recipe) {
    if (!koleksi.find(r => r.id === recipe.id)) { 
      setKoleksi([...koleksi, recipe]);
    }
  }

  // KOMPONEN SIDEBAR (DIPERBAIKI DENGAN <Link>)
  const Sidebar = () => (
    <aside className="menu sidebar-custom">
      <div className="has-text-centered" style={{ marginBottom: 32 }}>
        <img src="https://img.icons8.com/fluency/48/chef-hat.png" alt="logo" style={{ width: 32, marginBottom: 8 }} />
        <div style={{ fontWeight: 700, fontSize: 28, color: "#4d2600", marginTop: 8 }}>cook.io</div>
      </div>
      <ul className="menu-list">
        <li>
          {/* Link ke Homepage/Root untuk 'Cari' */}
          <Link to="/" className="is-active sidebar-active">
            <span className="icon" style={{ color: "#ff914d" }}><i className="fas fa-search"></i></span>
            <span style={{ color: "#ff914d", fontWeight: 600, marginLeft: 8 }}>Cari</span>
          </Link>
        </li>
        <li>
          {/* Link ke halaman Premium */}
          <Link to="/premium"> 
            <span className="icon"><i className="fas fa-crown"></i></span>
            <span style={{ marginLeft: 8 }}>Premium</span>
          </Link>
        </li>
        {user && ( // Tampilkan menu ini hanya jika user sudah login
          <>
            <li>
              {/* Link ke halaman Tambah Resep */}
              <Link to="/tambah-resep">
                <span className="icon"><i className="fas fa-plus-circle"></i></span>
                <span style={{ marginLeft: 8 }}>Tambah Resep</span>
              </Link>
            </li>
            <li>
              {/* Link ke halaman Resep Saya */}
              <Link to="/resep-saya">
                <span className="icon"><i className="fas fa-user"></i></span>
                <span style={{ marginLeft: 8 }}>Resep Saya</span>
              </Link>
            </li>
          </>
        )}
        <li>
          {/* Link ke halaman Koleksi Resep (contoh) */}
          <Link to="/koleksi-resep"> 
            <span className="icon"><i className="fas fa-bookmark"></i></span>
            <span style={{ marginLeft: 8 }}>Koleksi Resep</span>
          </Link>
          {user && ( // Tampilkan submenu ini hanya jika user sudah login
            <ul style={{ marginLeft: 24, marginTop: 8 }}>
              <li>
                {/* Link ke halaman Semua Koleksi */}
                <Link to="/koleksi-resep/semua">
                  <span className="icon"><i className="fas fa-book"></i></span>
                  <span style={{ marginLeft: 8 }}>Semua</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>{koleksi.length} Resep</span>
                </Link>
              </li>
              <li>
                {/* Link ke halaman Koleksi Tersimpan */}
                <Link to="/koleksi-resep/tersimpan">
                  <span className="icon"><i className="fas fa-bookmark"></i></span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>{koleksi.length} Resep</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      {!user && ( // Tampilkan ini hanya jika user BELUM login
        <div style={{ marginTop: 32, fontSize: 14, color: "#444" }}>
          Untuk mulai membuat koleksi resep, silakan
          <button type="button" className="link-button" onClick={() => navigate("/login")}>masuk</button>
          atau 
          <button type="button" className="link-button" onClick={() => navigate("/register")}>daftar</button>
        </div>
      )}
    </aside>
  );

  const fetchData = async () => {
    try {
      // Fetch resep per kategori
      const makananBerat = await getRecipesByCategoryApi("Makanan Berat");
      setMakananBeratRecipes(makananBerat);

      const cemilan = await getRecipesByCategoryApi("Cemilan / Snack");
      setCemilanRecipes(cemilan);

      const sarapan = await getRecipesByCategoryApi("Sarapan");
      setSarapanRecipes(sarapan);

      const makananSehat = await getRecipesByCategoryApi("Makanan Sehat");
      setMakananSehatRecipes(makananSehat);

      const masakanTradisional = await getRecipesByCategoryApi("Masakan Tradisional Indonesia");
      setMasakanTradisionalRecipes(masakanTradisional);

      const minuman = await getRecipesByCategoryApi("Minuman"); 
      setMinumanRecipes(minuman);

      const kue = await getRecipesByCategoryApi("Kue");
      setKueRecipes(kue);

    } catch (err) {
      console.error("Error fetching recipes:", err);
      // Pertimbangkan untuk menampilkan pesan error di UI jika fetch gagal
    }
  };

  return (
    <Routes>
      {/* ROUTE UTAMA APLIKASI */}
      <Route
        path="/login"
        element={
          <Login // KOMPONEN LOGIN DARI PAGES/LOGIN.JS
            onSuccess={loggedInUser => { // Terima user dari Login component
              setUser(loggedInUser);
              localStorage.setItem('user', JSON.stringify(loggedInUser)); // Simpan di localStorage
              navigate("/"); // Arahkan ke homepage setelah login
            }}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register // KOMPONEN REGISTER DARI PAGES/REGISTER.JS
            onSuccess={registeredUser => { // Terima user dari Register component
              // setUser(registeredUser); // Mungkin tidak perlu set user langsung setelah register, karena harus login dulu
              navigate("/login"); // Arahkan ke halaman login setelah register
            }}
          />
        }
      />
      
      {/* Route untuk Dashboard User (hanya jika sudah login) */}
      {user && (
        <Route path="/dashboard" element={<DashboardUser user={user} />} />
      )}

      {/* Route untuk daftar resep umum (jika ada halaman terpisah) */}
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
      
      {/* Route untuk Tambah Resep */}
      <Route path="/tambah-resep" element={<RecipeAdd onRefresh={fetchData} />} /> 
      
      {/* Route untuk Resep Saya */}
      <Route path="/resep-saya" element={<RecipeMine />} />

      {/* Route untuk Edit Resep */}
      <Route path="/edit-resep/:id" element={<RecipeEdit />} />

      {/* Route untuk Detail Resep */}
      <Route path="/recipe-detail/:id" element={<RecipeDetail />} />

      {/* ROUTE UNTUK HALAMAN PREMIUM */}
      <Route 
        path="/premium" 
        element={
          <Premium 
            user={user} 
            onLogout={() => { 
              setUser(null); 
              localStorage.removeItem("token");
              localStorage.removeItem("user"); // Hapus juga info user dari localStorage
              navigate("/"); // Arahkan ke homepage setelah logout
            }} 
          />
        } 
      />

      {/* Route Wildcard (*) - Ini adalah HOME PAGE atau FALLBACK */}
      <Route
        path="*" // Matches any path not matched above
        element={
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ marginLeft: 220, flex: 1 }}>
              <Navbar
                onLoginClick={() => navigate("/login")}
                user={user} // Pass user state to Navbar
                onLogout={() => {
                  setUser(null);
                  localStorage.removeItem("token");
                  localStorage.removeItem("user"); // Hapus juga info user dari localStorage
                  navigate("/"); // Arahkan ke homepage setelah logout
                }}
              />

              {/* HERO SECTION */}
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

              {/* Bagian Menu Terbaru dihapus sesuai permintaan */}

              {/* Grid Makanan Berat */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Makanan Berat
                  </h2>
                  <div className="columns is-multiline">
                    {makananBeratRecipes.map((item, i) => (
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

              {/* Grid Cemilan / Snack */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Cemilan / Snack
                  </h2>
                  <div className="columns is-multiline">
                    {cemilanRecipes.map((item, i) => (
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

              {/* Grid Sarapan */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Sarapan
                  </h2>
                  <div className="columns is-multiline">
                    {sarapanRecipes.map((item, i) => (
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

              {/* Grid Makanan Sehat */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Makanan Sehat
                  </h2>
                  <div className="columns is-multiline">
                    {makananSehatRecipes.map((item, i) => (
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

              {/* Grid Masakan Tradisional Indonesia */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Masakan Tradisional Indonesia
                  </h2>
                  <div className="columns is-multiline">
                    {masakanTradisionalRecipes.map((item, i) => (
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