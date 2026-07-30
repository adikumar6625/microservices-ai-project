import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.sub) return;
    api
      .getOrders(user.sub, token)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token]);

  return (
    <div>
      <header style={{ marginBottom: 32 }}>
        <p className="label-eyebrow">Order Service</p>
        <h1 style={{ fontSize: 28, marginTop: 6 }}>Your orders</h1>
      </header>

      {loading ? (
        <p style={{ color: "var(--ink-muted)" }}>Loading orders…</p>
      ) : error ? (
        <div className="card" style={{ padding: "32px 24px" }}>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6 }}>
            The Order Service doesn't have real endpoints built yet — this page is
            already wired up to call <code style={codeStyle}>GET /orders/:userId</code>,
            it just needs the backend route implemented (see the project README's
            build order). Once that's done, this page will work with zero changes.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>
            No orders yet. Once you place one, it'll show up here — and the AI
            Chat Service will be able to answer questions about it.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <div className="card" key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-faint)" }}>
                  #{order.id}
                </p>
                <p style={{ fontSize: 14, marginTop: 4 }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: { bg: "#FDF3E7", fg: "var(--amber)" },
    shipped: { bg: "var(--accent-soft)", fg: "var(--accent-dark)" },
    delivered: { bg: "#E6F6ED", fg: "var(--success)" },
    cancelled: { bg: "var(--error-soft)", fg: "var(--error)" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{
      background: c.bg, color: c.fg, fontSize: 12, fontWeight: 600,
      padding: "6px 12px", borderRadius: 999, textTransform: "capitalize",
    }}>
      {status || "pending"}
    </span>
  );
}

const codeStyle = {
  background: "var(--surface-sunken)",
  padding: "2px 6px",
  borderRadius: 4,
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
};
