import { useState } from "react";

export default function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(process.env.REACT_APP_API_URL + "/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, image_url }),
    });
    const data = await res.json();
    onAdd(data);
    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Judul Resep"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="URL Gambar"
        value={image_url}
        onChange={e => setImageUrl(e.target.value)}
      />
      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button type="submit">Tambah Resep</button>
    </form>
  );
}