import { useState } from "react";

export default function LoginForm({ isRegister, onSuccess, onSwitch }) {
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const username = e.target.username.value;
        const password = e.target.password.value;
        let nama, email;
        if (isRegister) {
          nama = e.target.nama.value;
          email = e.target.email.value;
        }
        const url = process.env.REACT_APP_API_URL + (isRegister ? "/auth/register" : "/auth/login");
        const body = isRegister
          ? { username, password, nama, email }
          : { username, password };
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) {
          if (isRegister) {
            alert("Registrasi berhasil! Silakan login.");
            onSwitch(false);
          } else {
            localStorage.setItem("token", data.token);
            onSuccess && onSuccess(data.user);
          }
        } else {
          setError(data.error || (isRegister ? "Registrasi gagal" : "Login gagal"));
        }
      }}
    >
      {isRegister && (
        <>
          <div className="field">
            <input className="input" name="nama" placeholder="Nama Lengkap" required />
          </div>
          <div className="field">
            <input className="input" name="email" type="email" placeholder="Email" required />
          </div>
        </>
      )}
      <div className="field">
        <input className="input" name="username" placeholder="Username" required />
      </div>
      <div className="field">
        <input className="input" name="password" type="password" placeholder="Password" required />
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button className="button is-warning is-fullwidth" type="submit">
        {isRegister ? "Daftar" : "Login"}
      </button>
    </form>
  );
}