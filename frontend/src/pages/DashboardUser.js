export default function DashboardUser({ user }) {
  return (
    <div style={{ padding: 32 }}>
      <h1 className="title is-3">Dashboard Pengguna</h1>
      <p>
        Selamat datang, <b>{user?.nama || user?.username}</b>!
      </p>
      <p>Email: {user?.email || "-"}</p>
      {/* Tambahkan fitur lain di sini */}
    </div>
  );
}