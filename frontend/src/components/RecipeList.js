import { useEffect, useState } from "react";
import { getRecipes } from "../api/api";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    getRecipes().then(setRecipes);
  }, []);
  return (
    <div>
      <h2>Daftar Resep</h2>
      <ul>
        {recipes.map(r => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}