# Search Proxy App

Full-stack application that acts as a search proxy for the DuckDuckGo Instant Answer API. The backend filters and formats results, persists search history to a local file, and the frontend provides a responsive interface with pagination, highlighting, and history management.

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Zustand, SCSS, Vitest   |
| Backend  | NestJS 11, TypeScript (strict), Axios, Jest          |
| Infra    | Docker, Docker Compose                               |

## Project Structure

```
search-proxy-app/
├── app/            # React frontend
├── server/         # NestJS backend
├── docker-compose.yml
└── README.md
```

Each sub-project has its own detailed `README.md` with architecture decisions, test strategy, and more.

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

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
docker compose up --build
```

| Service  | URL                    |
| -------- | ---------------------- |
| Backend  | http://localhost:3000   |
| Frontend | http://localhost:8080   |

## Tests

### Backend (32 tests)

```bash
cd server

# Unit tests
npm test

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

### Frontend (69 tests)

```bash
cd app

# Watch mode
npm test

# Single run
npm run test:run

# Coverage
npm run test:coverage
```

## API Endpoints

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/search?q=query`  | Search via query parameter   |
| POST   | `/search`          | Search via request body `{q}`|
| GET    | `/search/history`  | Get all search history       |

## Features

- **Search proxy** — Backend forwards queries to DuckDuckGo and returns filtered results (title + url)
- **Search history** — Persisted to local file, auto-loaded on server restart, capped at 100 entries
- **Client-side pagination** — Results paginated in the frontend (5 per page)
- **Search term highlighting** — Matching terms highlighted in results with match count
- **History sidebar** — Click to re-execute past searches
- **Request cancellation** — In-flight requests aborted when a new search starts
- **Provider abstraction** — Backend uses Liskov-compliant interface, allowing easy provider swap
- **Responsive UI** — Clean interface with SCSS, accessibility (ARIA), and loading states

## Technical Overview

- **Backend**: Pragmatic NestJS module with a `SearchProvider` interface (Liskov Substitution) for the search source, `HistoryRepository` interface for persistence, unified DTO validation, and strict TypeScript. Provider errors are caught and logged, HTTP requests have a 10s timeout.
- **Frontend**: Feature-based React architecture with the Container Hook pattern. Zustand manages global state with separated data/actions interfaces. Performance is optimized with `React.memo`, `useCallback`, `useMemo`, and `AbortController` for request cancellation.
