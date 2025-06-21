import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ onSuccess }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Untuk menampilkan pesan error dari backend
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error

    // Validasi sederhana di frontend
    if (!name || !username || !email || !password) {
      setError("Semua field harus diisi.");
      return;
    }

    try {
      // Ganti dengan URL API backend kamu untuk registrasi
      const response = await fetch("http://localhost:5000/api/auth/register", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama: name, username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika respons bukan OK (misal status 400, 409, 500)
        setError(data.message || "Gagal melakukan registrasi.");
        return;
      }

      // Jika registrasi berhasil
      alert("Registrasi berhasil! Silakan masuk.");
      // Panggil onSuccess dengan data user jika diperlukan, atau langsung navigasi
      onSuccess(data.user); // Anggap backend mengembalikan { user: { id, username, ... } }
      navigate("/login"); // Arahkan ke halaman login setelah berhasil register
      
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Terjadi kesalahan koneksi. Coba lagi nanti.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 className="title has-text-centered" style={{ marginBottom: 20 }}>Daftar Akun Baru</h2>
      {error && <div className="notification is-danger">{error}</div>} {/* Tampilkan pesan error */}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nama Lengkap</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Pilih username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              placeholder="Buat password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary is-fullwidth">
              Daftar
            </button>
          </div>
        </div>
      </form>

      <div className="has-text-centered" style={{ marginTop: '15px' }}>
        <p>Sudah punya akun? <span onClick={() => navigate('/login')} style={{ color: '#007bff', cursor: 'pointer' }}>Masuk</span></p>
      </div>
    </div>
  );
}