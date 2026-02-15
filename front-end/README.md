# Search Proxy - Frontend

A React application that serves as the frontend for the Search Proxy platform. It provides a clean search interface powered by DuckDuckGo through a backend proxy API, with client-side pagination, search term highlighting, and search history.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — fast build tool and dev server
- **Zustand** — lightweight global state management
- **SCSS** — styling with variables, nesting, and mixins
- **Axios** — HTTP client for API communication
- **Vitest** — unit and integration testing
- **React Testing Library** — component testing with user-centric approach
- **MSW (Mock Service Worker)** — API mocking for tests

## Architecture

The project follows a **feature-based architecture** with the **Container Hook pattern**, organizing code by domain rather than by technical type.

### Key Architectural Decisions

- **Feature-based structure** — All search-related code lives under `features/search/`, making it easy to find context and scale.
- **Container Hook pattern** — Each component is split into a pure view (`ComponentName.tsx`) and a container hook (`useComponentName.ts`). The view receives everything via props and has zero logic. The hook handles state, handlers, and computed values.
- **Three-layer hooks** — `Store → Domain Hooks → Container Hooks → Views`. Components never access the store directly.
- **Domain-oriented service** — `searchService.executeSearch()` hides HTTP transport details (GET vs POST). The UI never knows how the API is called.
- **Shared HTTP client** — Axios instance configured globally in `shared/lib/http/` with centralized interceptors for error handling.
- **Test factories** — Consistent test data creation via factory functions instead of hardcoded mock objects.
- **Custom render** — A shared `render()` function wraps components with all required providers, keeping tests clean.
- **Race condition protection** — Stale search responses are discarded via a search ID counter.

## Project Structure

```
src/
├── app/                              # Application bootstrap
│   ├── App.tsx                       # Root layout with aria-live regions
│   └── App.scss
│
├── features/
│   └── search/                       # Search domain (core feature)
│       ├── components/
│       │   ├── SearchInput/
│       │   │   ├── SearchInput.tsx    # Pure view
│       │   │   ├── useSearchInput.ts  # Container hook
│       │   │   ├── SearchInput.scss
│       │   │   └── index.tsx          # Connects hook + view
│       │   ├── ResultsList/
│       │   │   ├── ResultsList.tsx
│       │   │   ├── useResultsList.ts
│       │   │   ├── ResultsList.scss
│       │   │   └── index.tsx
│       │   ├── Pagination/
│       │   │   ├── Pagination.tsx
│       │   │   ├── usePaginationContainer.ts
│       │   │   ├── Pagination.scss
│       │   │   └── index.tsx
│       │   └── HistorySidebar/
│       │       ├── HistorySidebar.tsx
│       │       ├── useHistorySidebar.ts
│       │       ├── HistorySidebar.scss
│       │       └── index.tsx
│       ├── hooks/                    # Domain hooks (shared within feature)
│       │   ├── use-search.ts
│       │   ├── use-pagination.ts
│       │   ├── use-search-history.ts
│       │   └── index.ts
│       ├── store/
│       │   └── search-store.ts       # Zustand store with race condition protection
│       ├── services/
│       │   └── search.service.ts     # Domain service (executeSearch, getHistory)
│       ├── model/
│       │   └── search.ts             # TypeScript interfaces
│       ├── utils/
│       │   └── highlight.ts          # Text highlight + match counting
│       └── __tests__/
│           ├── unit/                 # Pure logic tests
│           │   └── search.highlight.unit.test.ts
│           ├── integration/          # Component behavior tests
│           │   ├── search.input.integration.test.tsx
│           │   ├── search.results.integration.test.tsx
│           │   ├── search.pagination.integration.test.tsx
│           │   ├── search.history.integration.test.tsx
│           │   └── search.flow.integration.test.tsx
│           └── store/                # State management tests
│               └── search.store.test.ts
│
├── shared/
│   ├── lib/
│   │   └── http/                     # Axios client + interceptors
│   │       ├── http.client.ts
│   │       ├── http.interceptors.ts
│   │       └── index.ts
│   ├── styles/
│   │   ├── _variables.scss           # Design tokens
│   │   └── _mixins.scss              # Reusable mixins
│   └── test/
│       ├── render.ts                 # Custom render with providers
│       ├── setup.ts                  # Vitest global setup (MSW, cleanup)
│       ├── mocks/
│       │   ├── handlers.ts
│       │   └── server.ts
│       └── factories/
│           └── search.factory.ts     # Test data factories
│
├── index.scss                        # Global styles
└── main.tsx                          # Entry point with root guard
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file (optional):

```env
VITE_API_BASE_URL=http://localhost:3000
```

Defaults to `http://localhost:3000` if not set.

### Run Development Server

```bash
npm run dev
```

### Run Tests

```bash
# Watch mode
npm test

# Single run
npm run test:run

# With coverage
npm run test:coverage
```

### Build for Production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Test Strategy

Tests are organized by **intent**, not by file location:

| Category | What it tests | Example |
|---|---|---|
| `unit/` | Pure logic, no DOM | highlight matching, edge cases |
| `integration/` | Component behavior with user interaction | type → search → see results |
| `store/` | Zustand actions, state transitions, error handling | search with API failure, pagination bounds |

**64 tests** across 7 test suites covering:
- Happy paths and error scenarios
- Race condition handling (stale response discard)
- Pagination bounds validation
- Network failures and API errors
- Full user flows (search → results → paginate → history replay)

## Features

- **Search Input** — Type a query and submit to search via the backend proxy
- **Results List** — Displays search results with title and clickable URL
- **Highlight** — Matching search terms are highlighted in result titles
- **Match Counter** — Shows total highlighted matches on the current page
- **Client-Side Pagination** — Results are paginated in the frontend (5 per page) with bounds validation
- **Search History Sidebar** — Shows previous searches; click to re-execute
- **Accessible** — ARIA labels, roles, live regions for screen readers

## API Endpoints Expected

The frontend expects the following endpoints from the backend:

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/search?q=query`  | Search via query parameter |
| POST   | `/search`          | Search via request body    |
| GET    | `/search/history`  | Get search history         |
