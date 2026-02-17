# Search Proxy App

Full-stack application that acts as a search proxy for the DuckDuckGo Instant Answer API. The backend filters and formats results, persists search history to a local file, and the frontend provides a responsive interface with pagination, highlighting, and history management.

## Tech Stack

| Layer    | Technology                                                                          |
| -------- | ----------------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Zustand, Tailwind CSS, shadcn/ui, lucide-react, Vitest |
| Backend  | NestJS 11, TypeScript (strict), Axios, class-validator, Jest, Supertest             |
| Infra    | Docker, Docker Compose, Nginx                                                       |

## Project Structure

```
search-proxy-app/
├── app/                 # React frontend
├── server/              # NestJS backend
├── docker-compose.yml
└── README.md
```

For detailed architecture, test strategy, and technical decisions, see each sub-project's README:

- **[Frontend (app/)](./app/README.md)** -- React architecture, Container Hook pattern, test strategy, features
- **[Backend (server/)](./server/README.md)** -- NestJS module structure, provider abstraction, API docs

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- Docker and Docker Compose (optional, for containerized setup)

### Environment Setup (required)

Before running the project, create the `.env` files for each sub-project:

```bash
cp app/.env.example app/.env
cp server/.env.example server/.env
```

Review and adjust the values if needed:

**`app/.env`**

| Variable            | Default                 | Description          |
| ------------------- | ----------------------- | -------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3000`  | Backend API base URL |

**`server/.env`**

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `3000`  | Server port |

### Run Locally (without Docker)

**1. Backend**

```bash
cd server
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.

**2. Frontend**

```bash
cd app
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Run with Docker

```bash
cp app/.env.example app/.env
cp server/.env.example server/.env
docker compose up --build
```

| Service  | URL                  |
| -------- | -------------------- |
| Frontend | http://localhost:8080 |
| Backend  | http://localhost:3000 |

## Tests

### Frontend (76 tests)

```bash
cd app

# Watch mode
npm test

# Single run
npm run test:run

# Coverage
npm run test:coverage
```

### Backend (43 tests)

```bash
cd server

# Unit tests
npm test

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

**Total: 119 tests** across both projects.

## API Endpoints

| Method | Endpoint                 | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| GET    | `/search?q=query`        | Search via query parameter                     |
| POST   | `/search`                | Search via request body `{q}`                  |
| GET    | `/search/history`        | Get all search history (sorted by most recent) |
| DELETE | `/search/history/:index` | Remove a specific history entry                |
| DELETE | `/search/history`        | Clear all history                              |

## Features

- **Search proxy** -- Backend forwards queries to DuckDuckGo and returns filtered results (title + url)
- **Search history** -- Persisted to local file (`data/history.json`), auto-loaded on server restart, capped at 100 entries
- **History management** -- Remove individual entries or clear all history (optimistic UI updates)
- **Client-side pagination** -- Results paginated in the frontend (5 per page) with ellipsis navigation
- **Search term highlighting** -- Matching terms highlighted in results with match count
- **History sidebar** -- Click to re-execute past searches, with timestamps (`dd/MM/yyyy - HH:mm:ss`) and remove/clear actions
- **Request cancellation** -- In-flight requests aborted when a new search starts
- **Provider abstraction** -- Backend uses Liskov-compliant `SearchProvider` interface, allowing easy provider swap
- **Responsive UI** -- Tailwind CSS + shadcn/ui with permanent sidebar on desktop, drawer on mobile/tablet
- **Accessible** -- ARIA labels, roles, live regions for screen readers

## Technical Overview

- **Backend**: Pragmatic NestJS module with a `SearchProvider` interface (Liskov Substitution) for the search source, `HistoryRepository` interface for persistence, unified DTO validation with input sanitization, and strict TypeScript. Provider errors are caught and logged, HTTP requests have a 10s timeout, and history save is non-blocking.
- **Frontend**: Feature-based React architecture with the Container Hook pattern. Zustand manages global state with separated data/actions interfaces. Performance is optimized with `React.memo`, `useCallback`, `useMemo`, and `AbortController` for request cancellation. UI built with Tailwind CSS and shadcn/ui components. Tests use MSW for API mocking and follow the AAA pattern.
