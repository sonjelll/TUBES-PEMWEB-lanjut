import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import RecipeForm from "./components/RecipeForm";

function App() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/recipes")
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  const handleAdd = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  return (
    <section className="hero is-fullheight is-primary is-bold">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
            🍲 Cook.io
          </h1>
          <h2 className="subtitle is-3">
            Temukan & Bagikan Resep Makanan Favoritmu!
          </h2>
          <p className="mb-5">
            Jelajahi berbagai resep lezat, simpan favoritmu, dan bagikan kreasi masakanmu bersama komunitas.
          </p>
          <a href="#" className="button is-warning is-large is-rounded">
            Mulai Jelajah Resep
          </a>
        </div>
      </div>
      <div>
        <h1>Daftar Resep</h1>
        <RecipeForm onAdd={handleAdd} />
        <ul>
          {recipes.map(r => (
            <li key={r.id}>
              <b>{r.title}</b>
              {r.image_url && <img src={r.image_url} alt={r.title} width={100} />}
              <div>{r.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;


