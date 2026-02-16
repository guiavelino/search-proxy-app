export interface SearchResult {
  title: string;
  url: string;
}

export interface HistoryEntry {
  query: string;
  timestamp: string;
}

export const MAX_QUERY_LENGTH = 200;
export const MAX_HISTORY_ENTRIES = 100;
