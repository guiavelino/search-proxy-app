import { SearchService } from './search.service';
import { SearchQueryDto, SearchBodyDto } from './search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByQuery(dto: SearchQueryDto): Promise<import("./search.types").SearchResult[]>;
    searchByBody(dto: SearchBodyDto): Promise<import("./search.types").SearchResult[]>;
    getHistory(): Promise<import("./search.types").HistoryEntry[]>;
}
