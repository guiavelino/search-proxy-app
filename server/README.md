# Server — Search Proxy API

Backend API built with **NestJS** that acts as a proxy for the DuckDuckGo Instant Answer API. It filters results (title + url), persists search history to a local file, and automatically reloads it on restart.

## Tech Stack

- **NestJS 11** — Framework
- **TypeScript (strict mode)** — Language
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
      duckduckgo.types.ts            # DuckDuckGo API response types
    history/                         # File-based history persistence
      file-history.service.ts
    search.types.ts                  # Domain types + constants
    search.dto.ts                    # Request validation DTO (with trim transform)
    search.controller.ts             # HTTP endpoints (explicit return types)
    search.service.ts                # Orchestration (provider + history)
    search.module.ts                 # Module wiring
  app.config.ts                      # Shared config (ValidationPipe)
  app.module.ts
  main.ts
```

### Key Decisions

- **Provider abstraction (Liskov)**: `SearchProvider` interface allows swapping DuckDuckGo for any other provider without changing the service or controller. New providers just implement the interface and get registered in the module.
- **Centralized types**: `search.types.ts` holds domain types (`SearchResult`, `HistoryEntry`) and constants (`MAX_QUERY_LENGTH`, `MAX_HISTORY_ENTRIES`), mirroring the frontend's `model/search.ts` pattern.
- **Single service layer**: Controller delegates everything to `SearchService` — no direct infrastructure access from the presentation layer.
- **Unified DTO**: A single `SearchDto` is used for both GET and POST endpoints, eliminating duplication.
- **Shared config**: `ValidationPipe` configuration is extracted to `app.config.ts` at the app root, shared between `main.ts` and integration tests.
- **Error handling**: Provider throws `InternalServerErrorException` with a user-friendly message (not raw Axios errors) and logs details via NestJS Logger. Bootstrap has `.catch()` with graceful shutdown.
- **Non-blocking history**: History save is fire-and-forget — if persistence fails, search results are still returned. Errors are logged but don't break the response.
- **Input sanitization**: DTO trims whitespace from queries via `@Transform` before validation.
- **HTTP timeout**: External API calls have a 10s timeout to prevent hanging requests.
- **History cap**: History is limited to the last 100 entries to prevent unbounded file growth.
- **File-based persistence**: History is stored as JSON in `data/history.json`. The `data/` directory is created automatically at runtime — no need to track it in the repository.
- **Validation**: DTO with `class-validator` decorators + global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`.
- **Strict TypeScript**: `strict: true` for maximum type safety.
- **CORS enabled**: Ready for cross-origin requests from the frontend.

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
# Unit tests (25 tests)
npm test

# Integration tests (7 tests)
npm run test:integration

# All tests at once
npm run test:all
```

**Total: 32 tests** covering service logic, provider parsing (including error handling and timeout), file persistence (including history cap), and full HTTP endpoint flows.

## Docker

```bash
# From project root
docker compose up --build
```

The production Docker image uses a dedicated stage for production-only dependencies (`npm ci --omit=dev`), keeping the image lean.

The server runs on port **3000** by default (configurable via `PORT` env var).

## Environment

| Variable | Default | Description  |
| -------- | ------- | ------------ |
| `PORT`   | `3000`  | Server port  |
