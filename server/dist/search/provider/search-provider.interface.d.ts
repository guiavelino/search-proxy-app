import type { SearchResult } from '../search.types';
export declare const SEARCH_PROVIDER: unique symbol;
export interface SearchProvider {
    search(query: string): Promise<SearchResult[]>;
}
