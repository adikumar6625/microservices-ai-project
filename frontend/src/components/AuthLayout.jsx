export default function AuthLayout({ eyebrow, title, children, footer }) {
  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brandMark}>N</div>
        <h1 style={styles.leftTitle}>Nexus</h1>
        <p style={styles.leftSub}>
          A microservices platform with an AI support agent that answers
          questions using your real order and product data.
        </p>
        <div style={styles.serviceList}>
          {["Auth Service", "Product Service", "Order Service", "AI Chat Service"].map((s) => (
            <div key={s} style={styles.serviceRow}>
              <span className="status-dot online"></span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <p className="label-eyebrow">{eyebrow}</p>
          <h2 style={{ fontSize: 26, marginTop: 8, marginBottom: 28 }}>{title}</h2>
          {children}
          <p style={styles.footer}>{footer}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh" },
  left: {
    flex: 1,
    background: "var(--navy)",
    color: "white",
    padding: "56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 440,
  },
  brandMark: {
    width: 40, height: 40, borderRadius: 10,
    background: "var(--accent)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
    marginBottom: 20,
  },
  leftTitle: { fontSize: 30, color: "white", marginBottom: 12 },
  leftSub: { fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 36 },
  serviceList: { display: "flex", flexDirection: "column", gap: 12 },
  serviceRow: { display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.8)" },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  footer: { fontSize: 13, color: "var(--ink-muted)", marginTop: 20, textAlign: "center" },
};
