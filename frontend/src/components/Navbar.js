import React from "react";

export default function Navbar({ onLoginClick, user, onLogout }) {
  return (
    <nav className="navbar" style={{ boxShadow: "none", background: "transparent" }}>
      <div className="navbar-end" style={{ width: "60%", justifyContent: "flex-end" }}>
        {user ? (
          <>
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