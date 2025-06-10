// filepath: d:\PEMWEB-TUBES\frontend\src\pages\LoginPage.js
import LoginForm from "../components/LoginForm";
import { useState } from "react";

export default function LoginPage({ onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="box" style={{ maxWidth: 400, width: "100%", borderRadius: 16, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <img src="https://img.icons8.com/fluency/48/chef-hat.png" alt="logo" style={{ width: 48, marginBottom: 8 }} />
          <div style={{ fontWeight: 700, fontSize: 28, color: "#4d2600" }}>cook.io</div>
          <div style={{ marginTop: 8, fontSize: 18, color: "#444" }}>
            {isRegister ? "Daftar Akun Baru" : "Masuk ke Akun"}
          </div>
        </div>
        <LoginForm
          isRegister={isRegister}
          onSuccess={onSuccess}
          onSwitch={setIsRegister}
        />
        <div style={{ textAlign: "center", color: "#aaa", margin: "16px 0 0 0" }}>
          {isRegister ? (
            <>
              Sudah punya akun?{" "}
              <button className="link-button" type="button" onClick={() => setIsRegister(false)}>
                Login
              </button>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <button className="link-button" type="button" onClick={() => setIsRegister(true)}>
                Daftar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}