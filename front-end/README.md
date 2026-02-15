# Search Proxy - Frontend

A React application that serves as the frontend for the Search Proxy platform. It provides a clean search interface powered by DuckDuckGo through a backend proxy API, with client-side pagination, search term highlighting, and search history.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — fast build tool and dev server
- **Zustand** — lightweight global state management
- **Axios** — HTTP client for API communication
- **Vitest** — unit and integration testing
- **React Testing Library** — component testing with user-centric approach
- **MSW (Mock Service Worker)** — API mocking for tests

## Project Structure

The project follows a **feature-based architecture**, organizing code by domain rather than by technical type. This approach scales well, keeps responsibilities separated, and makes navigation intuitive.

```
src/
├── app/                          # Application bootstrap
│   ├── App.tsx                   # Root component (layout composition)
│   └── App.css
│
├── features/
│   └── search/                   # Search domain (core feature)
│       ├── components/
│       │   ├── SearchInput/      # Search form with input and submit
│       │   ├── ResultsList/      # Results with highlight and match counter
│       │   ├── Pagination/       # Client-side pagination controls
│       │   └── HistorySidebar/   # History sidebar with re-search
│       ├── hooks/
│       │   ├── use-search.ts     # Search query, submit, loading state
│       │   ├── use-pagination.ts # Page navigation, paginated results
│       │   └── use-search-history.ts # History loading and replay
│       ├── store/
│       │   └── search-store.ts   # Zustand store (query, results, history, page)
│       ├── services/
│       │   └── search-api.ts     # API client (GET/POST /search, GET /history)
│       ├── model/
│       │   └── search.ts         # TypeScript interfaces (SearchResult, HistoryEntry)
│       ├── utils/
│       │   └── highlight.ts      # Text highlight + match counting logic
│       └── __tests__/
│           ├── unit/             # Pure logic tests
│           │   └── search.highlight.unit.test.ts
│           ├── integration/      # Component behavior tests
│           │   ├── search.input.integration.test.tsx
│           │   ├── search.results.integration.test.tsx
│           │   ├── search.pagination.integration.test.tsx
│           │   ├── search.history.integration.test.tsx
│           │   └── search.flow.integration.test.tsx
│           └── store/            # State management tests
│               └── search.store.test.ts
│
├── shared/
│   ├── test/
│   │   ├── render.ts            # Custom render with providers
│   │   ├── setup.ts             # Vitest global setup (MSW, cleanup)
│   │   ├── mocks/
│   │   │   ├── handlers.ts      # MSW request handlers
│   │   │   └── server.ts        # MSW server instance
│   │   └── factories/
│   │       └── search.factory.ts # Test data factories
│   └── ui/                       # Shared UI components (extensible)
│
├── index.css                     # Global styles
└── main.tsx                      # Entry point
```

### Architecture Decisions

- **Feature-based structure**: All search-related code lives under `features/search/`, making it easy to find context and scale the project.
- **Custom hooks layer**: Components are decoupled from the Zustand store via hooks (`useSearch`, `usePagination`, `useSearchHistory`), improving testability and separation of concerns.
- **Model folder**: Types and interfaces live in `model/`, providing a clear contract layer without over-engineering.
- **Test strategy**: Tests are organized by intent — `unit/` for pure logic, `integration/` for component behavior, `store/` for state management — following a staff-level testing approach.
- **Test factories**: Consistent test data creation via factory functions in `shared/test/factories/`.
- **Custom render**: A shared `render()` function wraps components with all required providers, keeping tests clean and consistent.

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

## Features

- **Search Input** — Type a query and submit to search via the backend proxy
- **Results List** — Displays search results with title and clickable URL
- **Highlight** — Matching search terms are highlighted in result titles
- **Match Counter** — Shows total highlighted matches on the current page
- **Client-Side Pagination** — Results are paginated in the frontend (5 per page)
- **Search History Sidebar** — Shows previous searches; click to re-execute
- **Responsive Layout** — Clean layout with sidebar and main content area

## API Endpoints Expected

The frontend expects the following endpoints from the backend:

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/search?q=query`  | Search via query parameter |
| POST   | `/search`          | Search via request body    |
| GET    | `/search/history`  | Get search history         |
