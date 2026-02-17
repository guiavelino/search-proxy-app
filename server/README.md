# Server — Search Proxy API

Backend API built with **NestJS** that acts as a proxy for the DuckDuckGo Instant Answer API. It filters results (title + url), persists search history to a local file, and automatically reloads it on restart.

## Tech Stack

- **NestJS 11** — Framework
- **TypeScript (strict mode)** — Language
- **Axios** — HTTP client for DuckDuckGo API
- **class-validator / class-transformer** — DTO validation and input sanitization
- **Jest / Supertest** — Unit & integration tests
- **Docker** — Containerization

## Architecture

Pragmatic NestJS module structure — flat enough to avoid ceremony, structured enough to keep responsibilities clear.

```
src/
  search/
    provider/                          # Search provider abstraction
      provider.interface.ts            # SearchProvider interface + DI token (Liskov)
      duckduckgo/                      # DuckDuckGo implementation
        duckduckgo.provider.ts
        duckduckgo.types.ts
    history/                           # History persistence abstraction
      history.interface.ts             # HistoryRepository interface + DI token
      history.service.ts               # HistoryService (file-based implementation)
    search.types.ts                    # Domain types + constants
    search.dto.ts                      # Request validation DTO (with trim transform)
    search.controller.ts               # HTTP endpoints
    search.service.ts                  # Orchestration (provider + history)
    search.module.ts                   # Module wiring
  app.config.ts                        # Shared config (ValidationPipe)
  app.module.ts
  main.ts

test/
  unit/                                # Unit tests (mocked dependencies)
    search.service.spec.ts
    history.service.spec.ts
    duckduckgo.provider.spec.ts
  integration/                         # HTTP endpoint tests (Supertest)
    search.integration.spec.ts
  jest-integration.json                # Jest config for integration tests
```

### Key Decisions

- **Provider abstraction (Liskov)**: `SearchProvider` interface allows swapping DuckDuckGo for any other provider without changing the service or controller. New providers just implement the interface and get registered in the module.
- **History abstraction**: `HistoryRepository` interface decouples the persistence mechanism. The current implementation uses the file system, but swapping to Redis, a database, or any other storage only requires a new implementation and a module binding change.
- **Centralized types**: `search.types.ts` holds domain types (`SearchResult`, `HistoryEntry`) and constants (`MAX_QUERY_LENGTH`, `MAX_HISTORY_ENTRIES`), mirroring the frontend's `model/search.ts` pattern.
- **Single service layer**: Controller delegates everything to `SearchService` — no direct infrastructure access from the presentation layer.
- **Unified DTO**: A single `SearchDto` is used for both GET and POST endpoints, eliminating duplication.
- **Shared config**: `ValidationPipe` configuration is extracted to `app.config.ts` at the app root, shared between `main.ts` and integration tests.
- **Error handling**: Provider throws `InternalServerErrorException` with a user-friendly message (not raw Axios errors) and logs details via NestJS Logger. Bootstrap has `.catch()` with graceful shutdown.
- **Non-blocking history**: History save is fire-and-forget — if persistence fails, search results are still returned. Errors are logged but don't break the response.
- **Input sanitization**: DTO trims whitespace from queries via `@Transform` before validation.
- **HTTP timeout**: External API calls have a 10s timeout to prevent hanging requests.
- **History cap**: History is limited to the last 100 entries to prevent unbounded file growth.
- **File-based persistence**: History is stored as JSON in `data/history.json`. The `data/` directory is created automatically at runtime. In Docker, a named volume persists this directory across container restarts.
- **Validation**: DTO with `class-validator` decorators + global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`.
- **Strict TypeScript**: `strict: true` for maximum type safety.
- **CORS enabled**: Ready for cross-origin requests from the frontend.

## API Endpoints

| Method | Endpoint                 | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| GET    | `/search?q=query`        | Search via query parameter                     |
| POST   | `/search`                | Search via request body `{q}`                  |
| GET    | `/search/history`        | Get all search history (sorted by most recent) |
| DELETE | `/search/history/:index` | Remove a specific history entry                |
| DELETE | `/search/history`        | Clear all history                              |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Environment Setup

```bash
cp .env.example .env
```

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `3000`  | Server port |

### Install & Run

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## Tests

Tests follow the **AAA pattern** (Arrange-Act-Assert).

```bash
# Unit tests (33 tests)
npm test

# Integration tests (10 tests)
npm run test:integration

# All tests at once
npm run test:all
```

**Total: 43 tests** covering:
- Service orchestration logic (provider + history delegation)
- DuckDuckGo response parsing (topics, grouped topics, filtering, title extraction)
- Provider error handling and timeout
- File-based history persistence (save, load, cap, remove, clear)
- History sorting (most recent first)
- Full HTTP endpoint flows (GET, POST, DELETE, validation, error responses)

## Docker

```bash
# From the project root (search-proxy-app/)
cp server/.env.example server/.env
cp app/.env.example app/.env
docker compose up --build
```

The production Docker image uses a multi-stage build with a dedicated stage for production-only dependencies (`npm ci --omit=dev`), keeping the image lean.

The server runs on port **3000** by default (configurable via `PORT` env var).
