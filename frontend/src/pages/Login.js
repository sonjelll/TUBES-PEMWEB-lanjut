import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onSuccess }) { // Component ini mungkin namanya Login.js di folder pages
  const [username, setUsername] = useState(''); // Ubah dari email menjadi username
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error

    if (!username || !password) {
      setError("Username dan Password harus diisi.");
      return;
    }

    try {
      // Ganti dengan URL API backend kamu untuk login
      const response = await fetch("http://localhost:5000/api/auth/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Kirim username, bukan email
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal. Periksa username dan password Anda.");
        return;
      }

      // Jika login berhasil
      // Simpan token (jika backend mengembalikan token JWT)
      localStorage.setItem('token', data.token); 
      // Simpan informasi user (misal user ID, username)
      // Ini penting untuk "Resep Saya" atau personalisasi lainnya
      localStorage.setItem('user', JSON.stringify(data.user)); 

      alert("Login berhasil!");
      onSuccess(data.user); // Panggil onSuccess dengan data user yang diterima dari backend
      // onSuccess ini akan mengarahkan ke homepage atau dashboard
      
    } catch (err) {
      console.error("Error during login:", err);
      setError("Terjadi kesalahan koneksi. Coba lagi nanti.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: '20px', backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 className="title has-text-centered" style={{ marginBottom: 20 }}>Masuk ke Akun</h2>
      {error && <div className="notification is-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Username</label> {/* Ubah label */}
          <div className="control">
            <input
              className="input"
              type="text" // Ubah type menjadi text jika tidak perlu validasi email otomatis
              placeholder="Username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary is-fullwidth">Masuk</button>
          </div>
        </div>
      </form>
      <div className="has-text-centered" style={{ marginTop: '15px' }}>
        <p>Belum punya akun? <span onClick={() => navigate('/register')} style={{ color: '#007bff', cursor: 'pointer' }}>Daftar</span></p>
      </div>
    </div>
  );
}