import { useEffect, useState } from "react";
import "./App.css";
import "bulma/css/bulma.min.css";
import Navbar from "./components/Navbar";
import { useNavigate, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardUser from "./pages/DashboardUser";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Array dummy untuk placeholder resep populer
  const dummyPopular = [
    { title: "tongseng kambing", img: "https://www.unileverfoodsolutions.co.id/dam/global-ufs/mcos/SEA/calcmenu/recipes/ID-recipes/red-meats-&-red-meat-dishes/lamb-tongseng/main-header.jpg" },
    { title: "rendang daging", img: "https://cdn0-production-images-kly.akamaized.net/jAhRHll_RQBlFGXC18vg2VpRWZ0=/0x120:3000x1811/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3282059/original/075075700_1604028408-shutterstock_1788721670.jpg" },
    { title: "sate kambing", img: "https://th.bing.com/th/id/OIP.A8ywwqwVCFUzI3wkTORdHAHaEK?rs=1&pid=ImgDetMain" },
    { title: "sate maranggi", img: "https://img-global.cpcdn.com/recipes/93e63bc8b43d95a5/1200x630cq70/photo.jpg" },
    { title: "semur daging sapi", img: "https://th.bing.com/th/id/OIP.gHcpWeQQrUrx28vxQyv9cQHaE8?rs=1&pid=ImgDetMain" },
    { title: "gulai kambing", img: "https://www.masakapahariini.com/wp-content/uploads/2018/04/resep-gulai-kambing-sederhana.jpg" },
    { title: "soto ayam", img: "https://th.bing.com/th/id/OIP._Ck00ssbSDEUrFNuKZtzaAHaEK?rs=1&pid=ImgDetMain" },
    { title: "tongseng daging sapi", img: "https://th.bing.com/th/id/OIP.ZzhcaR9yis3vC6jazW7sIAHaE8?rs=1&pid=ImgDetMain" },
  ];

  const dummyMinuman = [
    { title: "es teh manis", img: "https://asset.kompas.com/crops/VEMd5H4lRZYH6QAc3zr0b003UfU=/0x0:880x587/1200x800/data/photo/2023/08/16/64dc53ca9f3db.jpg" },
    { title: "es jeruk", img: "https://img-global.cpcdn.com/recipes/0f5eb0a110d19101/1200x630cq70/photo.jpg" },
    { title: "kopi susu", img: "https://img.mbizmarket.co.id/products/thumbs/800x800/2022/11/08/191a310d7c7c0d2b1b838589603e1606.jpg" },
    { title: "es campur", img: "https://th.bing.com/th/id/R.2bfc734f9a4d34daabbe31ec0ad09729?rik=zb2ozIuDhQcscQ&riu=http%3a%2f%2fgrosirmesin.com%2fwp-content%2fuploads%2f2019%2f09%2fes-shanghai.jpg&ehk=cvV7U5U%2fj1t49DtHrOHLQ%2b3yIUmpfn6DlJk5p6OxuPg%3d&risl=&pid=ImgRaw&r=0" },
  ];

  const dummyKue = [
    { title: "Kue Bolu", img: "https://th.bing.com/th/id/OIP.uM4NA6fGVtbIqOUMmlnUXwHaHO?rs=1&pid=ImgDetMain" },
    { title: "Brownies", img: "https://th.bing.com/th/id/OIP.jX4CSlT_z5NuJ5gV91QgfgHaKX?rs=1&pid=ImgDetMain" },
    { title: "Cheesecake", img: "https://hips.hearstapps.com/hmg-prod/images/delish-202105-strawberrycheesecake-135-ls-1623955969.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*" },
    { title: "Donat", img: "https://asset.kompas.com/crops/K2t9N6w843qx_5Qj6zofZ5pw930=/0x0:1000x667/1200x800/data/photo/2021/06/23/60d2cdb323f51.jpg" },
  ];

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/recipes")
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar kiri
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
        <li>
          <a>
            <span className="icon"><i className="fas fa-bookmark"></i></span>
            <span style={{ marginLeft: 8 }}>Koleksi Resep</span>
          </a>
        </li>
      </ul>
      <div style={{ marginTop: 32, fontSize: 14, color: "#444" }}>
        Untuk mulai membuat koleksi resep, silakan
        <button type="button" className="link-button" onClick={() => navigate("/login")}>masuk</button>
        atau 
        <button type="button" className="link-button" onClick={() => navigate("/register")}>daftar</button>
      </div>
    </aside>
  );

  // --- PENTING: Routing di level root ---
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
      {/* Route utama (landing/dashboard) */}
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
                    {(filteredRecipes.length === 0 ? dummyPopular : filteredRecipes.slice(0, 8)).map((item, i) => (
                      <div className="column is-3" key={item.id || i}>
                        <div className="populer-card">
                          <img
                            src={item.image_url || item.img}
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

              {/* Grid Minuman Minuman */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Minuman 
                  </h2>
                  <div className="columns is-multiline">
                    {dummyMinuman.map((item, i) => (
                      <div className="column is-3" key={i}>
                        <div className="populer-card">
                          <img
                            src={item.img}
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

              {/* Grid Minuman Kue */}
              <section className="section">
                <div className="container">
                  <h2 className="title is-4" style={{ color: "#444", marginBottom: 24 }}>
                    Kue
                  </h2>
                  <div className="columns is-multiline">
                    {dummyKue.map((item, i) => (
                      <div className="column is-3" key={i}>
                        <div className="populer-card">
                          <img
                            src={item.img}
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

