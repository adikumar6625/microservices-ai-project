import { useState, useRef, useEffect } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI support assistant. Ask me anything about our products or your orders." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setSending(true);

    try {
      const { reply } = await api.sendChatMessage(userMessage.content, token);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      <header style={{ marginBottom: 20 }}>
        <p className="label-eyebrow">AI Chat Service · Claude API</p>
        <h1 style={{ fontSize: 28, marginTop: 6 }}>Support assistant</h1>
      </header>

      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {sending && <ChatBubble role="assistant" content="…thinking" pending />}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="error-banner" style={{ margin: "0 24px 12px" }}>{error}</div>
        )}

        <form onSubmit={handleSend} style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid var(--border)" }}>
          <input
            placeholder="Ask about an order, a product, anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
          />
          <button className="btn-accent" type="submit" disabled={sending || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ role, content, pending }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "70%",
          background: isUser ? "var(--navy)" : "var(--surface-sunken)",
          color: isUser ? "white" : "var(--ink)",
          padding: "10px 14px",
          borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          fontSize: 14,
          lineHeight: 1.5,
          opacity: pending ? 0.6 : 1,
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    </div>
  );
}
