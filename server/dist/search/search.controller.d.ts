import { SearchService } from './search.service';
import { SearchDto } from './search.dto';
import type { SearchResult, HistoryEntry } from './search.types';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByQuery(dto: SearchDto): Promise<SearchResult[]>;
    searchByBody(dto: SearchDto): Promise<SearchResult[]>;
    getHistory(): Promise<HistoryEntry[]>;
    removeHistoryEntry(index: number): Promise<void>;
    clearHistory(): Promise<void>;
}
