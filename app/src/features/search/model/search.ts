export interface SearchResult {
  title: string
  url: string
}

export interface HistoryEntry {
  query: string
  timestamp: string
}

export const MAX_QUERY_LENGTH = 200
export const RESULTS_PER_PAGE = 5
export const MAX_VISIBLE_PAGES = 5
