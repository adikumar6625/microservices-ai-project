import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

const navItems = [
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/chat", label: "AI Support" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [gatewayStatus, setGatewayStatus] = useState("pending"); // pending | online | offline

  useEffect(() => {
    let cancelled = false;
    api
      .checkGatewayHealth()
      .then(() => !cancelled && setGatewayStatus("online"))
      .catch(() => !cancelled && setGatewayStatus("offline"));
    return () => { cancelled = true; };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brand}>
          <div style={styles.brandMark}>N</div>
          <span style={styles.brandName}>Nexus</span>
        </div>
        <p style={styles.brandSub}>Smart Support Platform</p>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <div style={styles.statusRow}>
          <span className={`status-dot ${gatewayStatus}`}></span>
          <span style={styles.statusText}>
            {gatewayStatus === "online" && "Gateway connected"}
            {gatewayStatus === "offline" && "Gateway unreachable"}
            {gatewayStatus === "pending" && "Checking gateway…"}
          </span>
        </div>

        <div style={styles.userRow}>
          <div style={styles.avatar}>{(user?.email || "?")[0].toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <p style={styles.userEmail} title={user?.email}>{user?.email}</p>
            <button className="btn-ghost" style={styles.logoutBtn} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minWidth: 240,
    height: "100vh",
    background: "var(--navy)",
    color: "white",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: {
    width: 32, height: 32, borderRadius: 8,
    background: "var(--accent)", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
  },
  brandName: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 },
  brandSub: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, marginLeft: 42 },
  nav: { display: "flex", flexDirection: "column", gap: 4, marginTop: 36 },
  navLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.7)",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  navLinkActive: {
    background: "rgba(255,255,255,0.08)",
    color: "white",
  },
  statusRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  statusText: { fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-mono)" },
  userRow: { display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 600, flexShrink: 0,
  },
  userEmail: {
    fontSize: 13, color: "white",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  logoutBtn: { padding: "2px 0", fontSize: 12, color: "rgba(255,255,255,0.55)" },
};
