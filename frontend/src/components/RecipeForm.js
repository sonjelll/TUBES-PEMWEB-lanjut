import { useState } from "react";

export default function RecipeForm({ onAdd, initialData }) {
  const [namaPembuat, setNamaPembuat] = useState(initialData?.namaPembuat || "");
  const [judulResep, setJudulResep] = useState(initialData?.judulResep || "");
  const [alatBahan, setAlatBahan] = useState(initialData?.alatBahan || "");
  const [caraMembuat, setCaraMembuat] = useState(initialData?.caraMembuat || "");
  const [kategori, setKategori] = useState(initialData?.kategori || ""); // Tambah state kategori
  const [gambar, setGambar] = useState(null); // Ini akan menyimpan objek File
  const [preview, setPreview] = useState(initialData?.image_url || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaPembuat || !judulResep || !alatBahan || !caraMembuat || !kategori) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    // Buat objek FormData untuk mengirim data form, termasuk file
    const formData = new FormData();
    formData.append("namaPembuat", namaPembuat);
    formData.append("judulResep", judulResep);
    formData.append("alatBahan", alatBahan);
    formData.append("caraMembuat", caraMembuat);
    formData.append("kategori", kategori); // Tambah kategori ke FormData
    
    // Hanya tambahkan gambar jika ada
    if (gambar) {
      formData.append("gambarResep", gambar); // Nama field ini penting, harus cocok dengan yang diharapkan backend
    }

    onAdd(formData); // Kirim FormData ke parent component (RecipeAdd)

    // Kosongkan form setelah submit
    setNamaPembuat("");
    setJudulResep("");
    setAlatBahan("");
    setCaraMembuat("");
    setKategori(""); // Reset kategori
    setGambar(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="field">
        <label className="label">Nama Pembuat</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={namaPembuat}
            onChange={(e) => setNamaPembuat(e.target.value)}
            placeholder="Masukkan nama pembuat"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Judul Resep</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={judulResep}
            onChange={(e) => setJudulResep(e.target.value)}
            placeholder="Masukkan judul resep"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Alat dan Bahan</label>
        <div className="control">
          <textarea
            className="textarea"
            value={alatBahan}
            onChange={(e) => setAlatBahan(e.target.value)}
            placeholder="Masukkan alat dan bahan"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Cara Membuat</label>
        <div className="control">
          <textarea
            className="textarea"
            value={caraMembuat}
            onChange={(e) => setCaraMembuat(e.target.value)}
            placeholder="Masukkan cara membuat"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Kategori</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="">Pilih kategori</option>
              <option value="Makanan Berat">Makanan Berat</option>
              <option value="Cemilan / Snack">Cemilan / Snack</option>
              <option value="Sarapan">Sarapan</option>
              <option value="Makanan Sehat">Makanan Sehat</option>
              <option value="Masakan Tradisional Indonesia">Masakan Tradisional Indonesia</option>
              <option value="Minuman">Minuman</option>
              <option value="Kue">Kue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Gambar Resep</label>
        <div className="control">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {preview && (
          <figure className="image is-128x128" style={{ marginTop: 10 }}>
            <img src={preview} alt="Preview" />
          </figure>
        )}
      </div>

      <div className="field is-grouped is-grouped-right">
        <div className="control">
          <button type="submit" className="button is-primary">
            Simpan Resep
          </button>
        </div>
      </div>
    </form>
  );
}
