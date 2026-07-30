import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function loadProducts() {
    setLoading(true);
    api
      .getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <p className="label-eyebrow">Product Service</p>
          <h1 style={{ fontSize: 28, marginTop: 6 }}>Catalog</h1>
        </div>
        <button className="btn-accent" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </header>

      {showForm && (
        <NewProductForm
          token={token}
          onCreated={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}

      {error && <div className="error-banner" style={{ marginBottom: 20 }}>{error}</div>}

      {loading ? (
        <p style={{ color: "var(--ink-muted)" }}>Loading products…</p>
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {products.map((p) => (
            <div className="card" key={p._id}>
              <p className="label-eyebrow">{p.category}</p>
              <h3 style={{ fontSize: 16, marginTop: 8, marginBottom: 6 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 16, lineHeight: 1.5 }}>
                {p.description}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--navy)" }}>
                ${Number(p.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewProductForm({ token, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.createProduct({ name, description, price: Number(price), category }, token);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 28, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
      {error && <div className="error-banner" style={{ gridColumn: "1 / -1" }}>{error}</div>}
      <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input
        placeholder="Price"
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <div />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        style={{ gridColumn: "1 / -1" }}
      />
      <button className="btn-primary" type="submit" disabled={saving} style={{ gridColumn: "1 / -1", justifySelf: "start" }}>
        {saving ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}

function EmptyState() {
  return (
    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
      <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>
        No products yet. Add your first one to see it appear here — and later, the AI Chat Service will be able to reference it too.
      </p>
    </div>
  );
}
