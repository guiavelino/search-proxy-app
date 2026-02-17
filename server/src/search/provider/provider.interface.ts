import type { SearchResult } from '../search.types';

export const SEARCH_PROVIDER = Symbol('SEARCH_PROVIDER');

export interface SearchProvider {
  search(query: string): Promise<SearchResult[]>;
}
