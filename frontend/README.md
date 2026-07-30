# Nexus — Frontend

A React (Vite) frontend for the Smart Support Platform. Talks only to the
API Gateway (`http://localhost:3000`) — never directly to a microservice,
which mirrors how the real system is designed.

## Setup

1. Make sure your backend is running first (`docker compose up` from the
   project root, in a separate terminal).
2. In this `frontend` folder:
   ```
   npm install
   npm run dev
   ```
3. Open the URL Vite prints (usually `http://localhost:5173`).

## What's built

| Page | Talks to | Status |
|---|---|---|
| Sign up / Log in | Auth Service (via Gateway) | Fully working |
| Products | Product Service | Fully working — list + add |
| Orders | Order Service | Frontend done, waiting on the real backend routes (currently a stub) |
| AI Chat | AI Chat Service (Claude API) | Fully working |

The sidebar shows a live "Gateway connected" indicator — it actually pings
`GET /health` on your API Gateway when the app loads, so if your backend
isn't running, you'll see it turn red immediately instead of the app
silently failing.

## Design notes (for your report/presentation)

- **Palette**: deep navy (`#1B2340`) + teal accent (`#0F9E97`) — chosen to
  read as "trustworthy infrastructure" rather than a generic SaaS look.
- **Typography**: Space Grotesk for headings (technical, geometric),
  Inter for body text, IBM Plex Mono for small labels/status text — the
  monospace touch nods to the fact this is, under the hood, a systems
  project.
- **Signature element**: the sidebar's live service-status dot. It's a
  small detail, but it's the one piece of UI that's actually querying your
  real backend architecture in real time, which ties the design back to
  what makes this project distinctive: it's not just a chat UI, it's a
  window into a running microservices system.

## Folder structure

```
frontend/src/
├── api.js                 # All backend calls go through here
├── context/AuthContext.jsx  # Holds the JWT + decoded user info
├── components/
│   ├── Sidebar.jsx         # Nav + live gateway health check
│   ├── ProtectedRoute.jsx  # Redirects to /login if not authenticated
│   └── AuthLayout.jsx      # Shared layout for login/signup
└── pages/
    ├── LoginPage.jsx
    ├── SignupPage.jsx
    ├── ProductsPage.jsx
    ├── OrdersPage.jsx
    └── ChatPage.jsx
```
