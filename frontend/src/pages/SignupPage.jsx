import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import AuthLayout from "../components/AuthLayout.jsx";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      {success ? (
        <div style={{ color: "var(--success)", fontSize: 14 }}>
          Account created — taking you to sign in…
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div className="error-banner">{error}</div>}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 6 }}>
              At least 8 characters.
            </p>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

const labelStyle = { display: "block", fontSize: 13, color: "var(--ink-muted)", marginBottom: 6 };
