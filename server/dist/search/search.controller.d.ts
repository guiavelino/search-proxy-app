import { SearchService } from './search.service';
import { SearchDto } from './search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByQuery(dto: SearchDto): Promise<import("./search.types").SearchResult[]>;
    searchByBody(dto: SearchDto): Promise<import("./search.types").SearchResult[]>;
    getHistory(): Promise<import("./search.types").HistoryEntry[]>;
}
