import { Inject, Injectable, Logger } from '@nestjs/common';
import { SEARCH_PROVIDER } from './provider/search-provider.interface';
import type { SearchProvider } from './provider/search-provider.interface';
import { HISTORY_SERVICE } from './history/history.interface';
import type { HistoryService } from './history/history.interface';
import type { SearchResult, HistoryEntry } from './search.types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject(SEARCH_PROVIDER)
    private readonly searchProvider: SearchProvider,
    @Inject(HISTORY_SERVICE)
    private readonly historyService: HistoryService,
  ) {}

  async search(query: string): Promise<SearchResult[]> {
    const results = await this.searchProvider.search(query);

    this.historyService.save(query).catch((error) => {
      this.logger.error(
        `Failed to save history for "${query}"`,
        error instanceof Error ? error.message : String(error),
      );
    });

    return results;
  }

  async getHistory(): Promise<HistoryEntry[]> {
    return this.historyService.findAll();
  }
}
