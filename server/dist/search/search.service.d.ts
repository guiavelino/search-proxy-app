import type { SearchProvider } from './provider/search-provider.interface';
import type { SearchResult, HistoryEntry } from './search.types';
import { FileHistoryService } from './history/file-history.service';
export declare class SearchService {
    private readonly searchProvider;
    private readonly historyService;
    constructor(searchProvider: SearchProvider, historyService: FileHistoryService);
    search(query: string): Promise<SearchResult[]>;
    getHistory(): Promise<HistoryEntry[]>;
}
