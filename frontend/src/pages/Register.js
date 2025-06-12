import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function Register({ onSuccess }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="box" style={{ maxWidth: 400, width: "100%", borderRadius: 16, padding: 32 }}>
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Daftar Akun Baru</h2>
        <LoginForm isRegister={true} onSuccess={onSuccess} onSwitch={() => {}} />
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="button is-light" onClick={() => navigate(-1)}>
            Kembali
          </button>
          <div style={{ textAlign: "center", fontSize: 14 }}>
            Sudah punya akun?{" "}
            <button className="link-button" type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}