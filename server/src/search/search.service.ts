import { Inject, Injectable } from '@nestjs/common';
import { SEARCH_PROVIDER } from './provider/search-provider.interface';
import type { SearchProvider } from './provider/search-provider.interface';
import type { SearchResult, HistoryEntry } from './search.types';
import { FileHistoryService } from './history/file-history.service';

@Injectable()
export class SearchService {
  constructor(
    @Inject(SEARCH_PROVIDER)
    private readonly searchProvider: SearchProvider,
    private readonly historyService: FileHistoryService,
  ) {}

  async search(query: string): Promise<SearchResult[]> {
    const results = await this.searchProvider.search(query);
    await this.historyService.save(query);
    return results;
  }

  async getHistory(): Promise<HistoryEntry[]> {
    return this.historyService.findAll();
  }
}
