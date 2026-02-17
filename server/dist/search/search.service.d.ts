import type { SearchProvider } from './provider/provider.interface';
import type { HistoryRepository } from './history/history.interface';
import type { SearchResult, HistoryEntry } from './search.types';
export declare class SearchService {
    private readonly searchProvider;
    private readonly historyRepository;
    private readonly logger;
    constructor(searchProvider: SearchProvider, historyRepository: HistoryRepository);
    search(query: string): Promise<SearchResult[]>;
    getHistory(): Promise<HistoryEntry[]>;
}
