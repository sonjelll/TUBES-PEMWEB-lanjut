import React from "react";

export default function Navbar({ onLoginClick, user, onLogout }) {
  return (
    <nav className="navbar" style={{ boxShadow: "none", background: "transparent" }}>
      <div className="navbar-end" style={{ width: "60%", justifyContent: "flex-end", alignItems: "center", display: "flex" }}>
        {user ? (
          <>
            <img
              src={user.avatar || "https://img.icons8.com/fluency/48/000000/user-male-circle.png"}
              alt="User Avatar"
              style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
            />
            <span style={{ marginRight: 16 }}>Halo, {user.nama || user.username}</span>
            <button className="button is-light" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="button is-warning" style={{ margin: 16 }} onClick={onLoginClick}>
            Masuk
          </button>
        )}
      </div>
    </nav>
  );
}
