// Every request from the frontend goes through the API Gateway on port 3000,
// never directly to a microservice. This mirrors how the real system works.
const GATEWAY_URL = "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  signup: (email, password) =>
    request("/auth/signup", { method: "POST", body: { email, password } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  getProducts: () => request("/products"),

  createProduct: (product, token) =>
    request("/products", { method: "POST", body: product, token }),

  getOrders: (userId, token) =>
    request(`/orders/${userId}`, { token }),

  sendChatMessage: (message, token) =>
    request("/chat/message", { method: "POST", body: { message }, token }),

  checkGatewayHealth: () => request("/health"),
};
