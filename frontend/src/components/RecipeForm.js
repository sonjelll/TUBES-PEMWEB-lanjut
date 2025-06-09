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
    if (onAdd) onAdd(data);
    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="box" style={{ maxWidth: 500, margin: "32px auto" }}>
      <div className="field">
        <label className="label">Judul Resep</label>
        <div className="control">
          <input
            className="input"
            placeholder="Judul Resep"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="label">URL Gambar</label>
        <div className="control">
          <input
            className="input"
            placeholder="URL Gambar"
            value={image_url}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Deskripsi</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Deskripsi"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="field is-grouped is-grouped-right">
        <div className="control">
          <button type="submit" className="button is-primary">Tambah Resep</button>
        </div>
      </div>
    </form>
  );
}