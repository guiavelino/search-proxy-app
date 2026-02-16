# Server — Search Proxy API

Backend API built with **NestJS** that acts as a proxy for the DuckDuckGo Instant Answer API. It filters results (title + url), persists search history to a local file, and automatically reloads it on restart.

## Tech Stack

- **NestJS 11** — Framework
- **TypeScript** — Language
- **Axios** — HTTP client for DuckDuckGo API
- **class-validator / class-transformer** — DTO validation
- **Jest / Supertest** — Unit & integration tests
- **Docker** — Containerization

## Architecture

Pragmatic NestJS module structure — flat enough to avoid ceremony, structured enough to keep responsibilities clear.

```
src/
  search/
    provider/                        # Search provider abstraction + implementations
      search-provider.interface.ts   # Interface + DI token (Liskov)
      duckduckgo.provider.ts         # DuckDuckGo implementation
    history/                         # File-based history persistence
      file-history.service.ts
    search.types.ts                  # Domain types (SearchResult, HistoryEntry)
    search.dto.ts                    # Request validation DTOs
    search.controller.ts             # HTTP endpoints
    search.service.ts                # Orchestration (provider + history)
    search.module.ts                 # Module wiring
  app.module.ts
  main.ts
```

### Key Decisions

- **Provider abstraction (Liskov)**: `SearchProvider` interface allows swapping DuckDuckGo for any other provider without changing the service or controller. New providers just implement the interface and get registered in the module.
- **Centralized types**: `search.types.ts` holds domain types (`SearchResult`, `HistoryEntry`), mirroring the frontend's `model/search.ts` pattern.
- **Single service layer**: Controller delegates everything to `SearchService` — no direct infrastructure access from the presentation layer.
- **File-based persistence**: History is stored as JSON in `data/history.json` and loaded automatically via `OnModuleInit`.
- **Validation**: DTOs with `class-validator` decorators + global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`.
- **CORS enabled**: Ready for cross-origin requests from the frontend.
- **Consistent naming**: Follows the same dot-separated convention as the frontend (`search.service.ts`, `search.types.ts`, `search.dto.ts`).

## API Endpoints

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/search?q=query`  | Search via query parameter   |
| POST   | `/search`          | Search via request body `{q}`|
| GET    | `/search/history`  | Get all search history       |

## Getting Started

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```

## Tests

```bash
# Unit tests (20 tests)
npm test

# Integration tests (7 tests)
npm run test:integration
```

**Total: 27 tests** covering service logic, provider parsing, file persistence, and full HTTP endpoint flows.

## Docker

```bash
# From project root
docker compose up --build
```

The server runs on port **3000** by default (configurable via `PORT` env var).

## Environment

| Variable | Default | Description  |
| -------- | ------- | ------------ |
| `PORT`   | `3000`  | Server port  |
