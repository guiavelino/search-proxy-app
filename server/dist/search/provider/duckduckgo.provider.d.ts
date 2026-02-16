import type { SearchResult } from '../search.types';
import type { SearchProvider } from './search-provider.interface';
export declare class DuckDuckGoProvider implements SearchProvider {
    private readonly logger;
    private readonly baseUrl;
    search(query: string): Promise<SearchResult[]>;
    private parseResponse;
    private flattenTopics;
    private extractTitle;
}
