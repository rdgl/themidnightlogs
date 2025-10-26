# The Midnight Logs

A full‑stack social micro‑blogging app for writing and sharing short posts (“logs”), following users, and browsing a personalized feed.

## Features

- Email/password authentication (JWT)
- Create, edit, delete posts with optional tags
- Global feed, My posts, and Following feed
- Like/unlike posts
- View user profiles, follow/unfollow
- Responsive React UI with Redux Toolkit state and React Router

## Tech stack

- Frontend: React 19, Vite 7, TypeScript, Redux Toolkit, React Router, Tailwind CSS
- Backend: Node.js, Express 5, MongoDB with Mongoose 8, JWT (jsonwebtoken), bcryptjs
- Tooling: pnpm, ESLint

## Monorepo layout

```
client/   # React + Vite app (TypeScript)
server/   # Express API + MongoDB (ESM)
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended)
- A running MongoDB instance (local or Atlas)

## Quick start (Windows PowerShell)

1) Clone/open the repo, then set up environments:

- Server env: create `server/.env` (see example below)
- Client env: create `client/.env` with the API URL

2) Install dependencies (run separately in each folder):

```powershell
# In server/
pnpm install

# In client/
pnpm install
```

3) Run the backend API:

```powershell
# In server/
pnpm run dev
# Server starts on http://localhost:5000 (by default)
```

4) Run the frontend dev server (new terminal):

```powershell
# In client/
pnpm run dev
# Vite dev server on http://localhost:5173
```

Important: The client expects an API base URL. Provide it via `VITE_API_URL` (see client env below). Without a proxy, requests to `/api` from the client dev server will 404.

## Environment variables

### Server (`server/.env`)

```ini
dbUrl=mongodb://localhost:27017/midnight_logs
JWT_SECRET=change-me
PORT=5000
# Allowed frontend origin for CORS (defaults to http://localhost:5173)
CLIENT_ORIGIN=http://localhost:5173
```

- `dbUrl` is required (the code checks `process.env.dbUrl`).
- `JWT_SECRET` is required for signing/verifying tokens.
- `PORT` is optional.
- `CLIENT_ORIGIN` is used by CORS.

### Client (`client/.env`)

```ini
# Point the frontend to your API base URL
VITE_API_URL=http://localhost:5000/api
```

If you plan to deploy the client and API under the same origin with a reverse proxy at `/api`, you can omit `VITE_API_URL` and rely on same-origin.

## How it works

- Auth is JWT-based. The client stores the token in localStorage and sends it as `Authorization: Bearer <token>`.
- CORS is configured to allow the `CLIENT_ORIGIN` and does not use cookies.
- MongoDB connection uses `dbUrl`.
- Client API base URL is resolved as:
  - `VITE_API_URL` if set
  - otherwise `window.location.origin + /api` (for same-origin setups)

## Available scripts

### Client (in `client/`)

- `pnpm run dev` — start Vite dev server
- `pnpm run build` — type-check and build production assets
- `pnpm run preview` — preview built assets locally
- `pnpm run lint` — run ESLint

### Server (in `server/`)

- `pnpm run dev` — start with nodemon
- `pnpm start` — start with node

## API overview

Base URL: `http://localhost:5000/api`

Auth header (for protected routes):

```
Authorization: Bearer <token>
```

### Auth
- POST `/auth/signup` — `{ name, email, password }` → `{ user, token }`
- POST `/auth/login` — `{ email, password }` → `{ user, token }`
- GET `/auth/me` — requires auth → `{ user }`

### Posts
- GET `/posts` — list latest posts
- GET `/posts/feed` — auth; feed excluding your own posts
- GET `/posts/following` — auth; posts from followed users
- GET `/posts/mine` — auth; your posts
- GET `/posts/:id` — get a post by id
- POST `/posts` — auth; `{ title, content, tags?: string[] | string }` → `{ post }`
- PUT `/posts/:id` — auth; update any of `{ title, content, tags }` → `{ post }`
- DELETE `/posts/:id` — auth; delete your post → `{ success: true }`
- POST `/posts/:id/like` — auth; toggle like → `{ post }`

### Users
- GET `/users/:id` — returns profile and whether current user follows them (requires auth per current code)
- POST `/users/:id/follow` — auth → `{ followersCount, followingCount, isFollowing: true }`
- POST `/users/:id/unfollow` — auth → `{ followersCount, followingCount, isFollowing: false }`

## Data models (simplified)

- User: `{ id, name, email, avatar?, bio?, followers[], following[] }`
- Post: `{ id, title, content, tags[], author (populated with name/email), likes[] }`

