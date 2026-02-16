import type { SearchResult } from '../search.types';
import type { SearchProvider } from './search-provider.interface';
export declare class DuckDuckGoProvider implements SearchProvider {
    private readonly baseUrl;
    search(query: string): Promise<SearchResult[]>;
    private flattenTopics;
    private extractTitle;
}
