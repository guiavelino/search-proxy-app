export interface SearchResult {
    title: string;
    url: string;
}
export interface HistoryEntry {
    query: string;
    timestamp: string;
}
export declare const MAX_QUERY_LENGTH = 200;
export declare const MAX_HISTORY_ENTRIES = 100;
