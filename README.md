# Smart Support Platform — AI-Integrated Microservices

Portfolio project: Node.js microservices architecture with an LLM-powered
AI Chat Service (Claude API) using function calling + RAG.

## Project structure

```
microservices-ai-project/
├── docker-compose.yml
├── .env.example
├── api-gateway/            # Entry point, routes to services, JWT check
├── services/
│   ├── auth-service/       # ✅ fully working — signup/login/JWT
│   ├── product-service/    # ✅ fully working — list/create products (MongoDB)
│   ├── order-service/      # 🚧 stub — build next
│   └── ai-chat-service/    # ✅ fully working — basic Claude API chat
└── frontend/               # ✅ React app — login, products, orders, chat
```

## Status

| Service        | Status                  |
|----------------|--------------------------|
| Auth Service   | Working (signup, login, JWT, bcrypt, Postgres) |
| API Gateway    | Working (routes to all services, JWT check) |
| Product Service| Working (list/create products, MongoDB) |
| Order Service  | Stub — health check only, build next |
| AI Chat Service| Working (basic Claude API chat — no function calling yet) |
| Frontend       | Working (React — login, products, orders UI, chat) |

## Quick start (Auth Service + Gateway only, for now)

1. Copy env file:
   ```
   cp .env.example .env
   ```
2. Start everything with Docker:
   ```
   docker compose up --build
   ```
3. Test the Gateway → Auth Service flow:
   ```
   curl -X POST http://localhost:3000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```
   Login should return a JWT. Save it — the next services you build will
   require it in an `Authorization: Bearer <token>` header.

## Build order (see the full report for rationale)

1. ~~Auth Service + Gateway~~ ✅ done — start here, run it, understand it
2. Product Service — copy the Auth Service's folder structure, swap Postgres
   for MongoDB, build simple CRUD
3. AI Chat Service — start with a single `/chat/message` endpoint that just
   calls the Claude API and returns a reply (no tools yet)
4. Order Service — once this exists, go back to AI Chat Service and add
   function calling so it can query order status
5. Wire up RabbitMQ/Redis for async events (order.created → AI service)
6. Add streaming (SSE) to the chat endpoint

Each numbered step is meant to be a separate working milestone you can
commit to git individually — that commit history is itself good portfolio
evidence of how you built this incrementally.
