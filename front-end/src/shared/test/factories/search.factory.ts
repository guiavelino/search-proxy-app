import type { SearchResult, HistoryEntry } from '@/features/search/model/search'

/**
 * Creates a fake SearchResult with optional overrides.
 * Useful for keeping test data consistent and expressive.
 */
export function createSearchResult(
  overrides?: Partial<SearchResult>,
): SearchResult {
  return {
    title: 'Default Search Result',
    url: 'https://example.com',
    ...overrides,
  }
}

/**
 * Creates an array of SearchResult with unique titles and URLs.
 */
export function createSearchResults(count: number): SearchResult[] {
  const titles = [
    'React Official Website',
    'React Tutorial',
    'React GitHub Repository',
    'Getting Started with React',
    'React Hooks Documentation',
    'React Component Patterns',
    'Advanced React Patterns',
    'React Testing Library',
    'React Router Documentation',
    'React State Management',
    'React Performance Tips',
    'React Server Components',
  ]

  return Array.from({ length: count }, (_, i) =>
    createSearchResult({
      title: titles[i] ?? `Search Result ${i + 1}`,
      url: `https://example.com/result-${i + 1}`,
    }),
  )
}

/**
 * Creates a fake HistoryEntry with optional overrides.
 */
export function createHistoryEntry(
  overrides?: Partial<HistoryEntry>,
): HistoryEntry {
  return {
    query: 'default query',
    timestamp: new Date().toISOString(),
    ...overrides,
  }
}
