# Search Proxy - App

A React application that serves as the frontend for the Search Proxy platform. It provides a clean search interface powered by DuckDuckGo through a backend proxy API, with client-side pagination, search term highlighting, and search history.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — fast build tool and dev server
- **Zustand** — lightweight global state management
- **SCSS** — styling with variables, nesting, and mixins
- **Axios** — HTTP client with centralized interceptors
- **Vitest** — unit and integration testing
- **React Testing Library** — component testing with user-centric approach
- **MSW (Mock Service Worker)** — API mocking for tests

## Architecture

The project follows a **feature-based architecture** with the **Container Hook pattern**, organizing code by domain rather than by technical type.

### Key Architectural Decisions

- **Feature-based structure** — All search-related code lives under `features/search/`, making it easy to find context and scale.
- **Container Hook pattern** — Each component is split into a pure view (`ComponentName.tsx`) and a container hook (`useComponentName.ts`). The view receives everything via props and has zero logic. The hook handles state, handlers, and computed values.
- **Three-layer hooks** — `Store → Domain Hooks → Container Hooks → Views`. Components never access the store directly.
- **Domain-oriented service** — `searchService.executeSearch()` hides HTTP transport details. The UI never knows how the API is called.
- **Shared HTTP client** — Axios instance configured globally in `shared/lib/http/` with centralized interceptors for error handling.
- **Separated state interface** — Zustand store types are split into `SearchData` (state) and `SearchActions` (behavior) for clarity.
- **Request cancellation** — `AbortController` cancels in-flight HTTP requests when a newer search is triggered, combined with a search ID counter to discard stale responses.
- **Performance-conscious memoization** — `React.memo` on pure views, `useCallback` on handlers, `useMemo` on derived data (`paginatedResults`, `highlightedResults`, `pages`). Local input state avoids global store updates on every keystroke.
- **Domain constants in model** — `RESULTS_PER_PAGE` and `MAX_QUERY_LENGTH` live in `model/search.ts`, not in components or the store.
- **Type-safe environment** — `vite-env.d.ts` types `import.meta.env` variables.
- **Test factories** — Consistent test data creation via factory functions instead of hardcoded mock objects.
- **Custom render** — A shared `render()` function wraps components with all required providers, keeping tests clean.
- **Resettable store internals** — `searchInternals` (abort controller, search ID) are grouped and exposed via `resetSearchInternals()` for test isolation.

### Naming Conventions

| Category | Convention | Example |
|---|---|---|
| React components | PascalCase | `SearchInput.tsx`, `ResultsList.tsx` |
| Container hooks | camelCase with `use` prefix | `useSearchInput.ts`, `usePagination.ts` |
| Domain hooks | kebab-case with `use-` prefix | `use-search.ts`, `use-pagination.ts` |
| Everything else | dot notation with domain prefix | `search.store.ts`, `search.service.ts`, `search.highlight.ts` |
| Tests | dot notation with intent suffix | `search.store.test.ts`, `search.input.integration.test.tsx` |
| SCSS partials | underscore prefix | `_variables.scss`, `_mixins.scss` |

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
│       │   │   ├── SearchInput.tsx    # Pure view (React.memo)
│       │   │   ├── useSearchInput.ts  # Container hook (useCallback)
│       │   │   ├── SearchInput.scss
│       │   │   └── index.tsx          # Connects hook + view
│       │   ├── ResultsList/
│       │   │   ├── ResultsList.tsx
│       │   │   ├── useResultsList.ts
│       │   │   ├── ResultsList.scss
│       │   │   └── index.tsx
│       │   ├── Pagination/
│       │   │   ├── Pagination.tsx
│       │   │   ├── usePagination.ts
│       │   │   ├── Pagination.scss
│       │   │   └── index.tsx
│       │   └── HistorySidebar/
│       │       ├── HistorySidebar.tsx
│       │       ├── useHistorySidebar.ts
│       │       ├── HistorySidebar.scss
│       │       └── index.tsx
│       ├── hooks/                    # Domain hooks (shared within feature)
│       │   ├── use-search.ts
│       │   ├── use-pagination.ts     # Memoized paginatedResults
│       │   ├── use-search-history.ts
│       │   └── index.ts
│       ├── store/
│       │   └── search.store.ts       # Zustand store (SearchData + SearchActions)
│       ├── services/
│       │   └── search.service.ts     # Domain service with AbortSignal support
│       ├── model/
│       │   └── search.ts             # Types + domain constants
│       ├── utils/
│       │   └── search.highlight.ts   # Text highlight + match counting
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
├── vite-env.d.ts                     # Typed environment variables
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

Tests follow the **AAA pattern** (Arrange-Act-Assert) with explicit comments on complex tests.

Tests are organized by **intent**, not by file location:

| Category | What it tests | Example |
|---|---|---|
| `unit/` | Pure logic, no DOM | highlight matching, edge cases |
| `integration/` | Component behavior with user interaction | type → search → see results |
| `store/` | Zustand actions, state transitions, error handling | search with API failure, pagination bounds |

**69 tests** across 7 test suites covering:
- Happy paths and error scenarios
- Race condition handling (AbortController + stale response discard)
- Pagination bounds validation
- Network failures and API errors
- Empty state feedback ("no results found")
- History loading states
- Input validation (max query length)
- Full user flows (search → results → paginate → history replay)

## Features

- **Search Input** — Type a query and submit to search via the backend proxy, with max length validation
- **Results List** — Displays search results with title and clickable URL
- **Empty State** — Shows feedback when a search returns no results
- **Highlight** — Matching search terms are highlighted in result titles
- **Match Counter** — Shows total highlighted matches on the current page
- **Client-Side Pagination** — Results are paginated (5 per page) with bounds validation
- **Search History Sidebar** — Shows previous searches with loading state; click to re-execute
- **Request Cancellation** — In-flight requests are aborted when a new search starts
- **Accessible** — ARIA labels, roles, live regions for screen readers
- **Consistent Dates** — `Intl.DateTimeFormat` for locale-stable date rendering

## API Endpoints Expected

The frontend expects the following endpoints from the backend:

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/search?q=query`  | Search via query parameter |
| POST   | `/search`          | Search via request body    |
| GET    | `/search/history`  | Get search history         |
