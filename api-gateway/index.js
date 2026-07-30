require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticate = require("./middleware/authenticate");

const app = express();
app.use(cors());

// NOTE: don't use express.json() here globally — body parsing before
// proxying can break http-proxy-middleware's request streaming. Each
// downstream service parses its own JSON body.

app.get("/health", (req, res) => res.json({ status: "ok", service: "api-gateway" }));

// --- Auth Service: public, no token required to signup/login ---
app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// --- Product Service: public reads (build this next) ---
app.use(
  "/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/products": "" },
  })
);

// --- Order Service: requires a valid JWT ---
app.use(
  "/orders",
  authenticate,
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/orders": "" },
  })
);

// --- AI Chat Service: requires a valid JWT ---
app.use(
  "/chat",
  authenticate,
  createProxyMiddleware({
    target: process.env.AI_CHAT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/chat": "" },
  })
);

app.use((req, res) => res.status(404).json({ error: "Route not found." }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));
