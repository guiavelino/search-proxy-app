import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SEARCH_PROVIDER } from './provider/search-provider.interface';
import { DuckDuckGoProvider } from './provider/duckduckgo/duckduckgo.provider';
import { HISTORY_SERVICE } from './history/history.interface';
import { FileHistoryService } from './history/file-history.service';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: SEARCH_PROVIDER,
      useClass: DuckDuckGoProvider,
    },
    {
      provide: HISTORY_SERVICE,
      useClass: FileHistoryService,
    },
  ],
})
export class SearchModule {}
