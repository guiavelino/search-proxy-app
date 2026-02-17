import type { SearchProvider } from './provider/search-provider.interface';
import type { HistoryService } from './history/history.interface';
import type { SearchResult, HistoryEntry } from './search.types';
export declare class SearchService {
    private readonly searchProvider;
    private readonly historyService;
    private readonly logger;
    constructor(searchProvider: SearchProvider, historyService: HistoryService);
    search(query: string): Promise<SearchResult[]>;
    getHistory(): Promise<HistoryEntry[]>;
}
