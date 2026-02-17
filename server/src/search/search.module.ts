import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SEARCH_PROVIDER } from './provider/provider.interface';
import { DuckDuckGoProvider } from './provider/duckduckgo/duckduckgo.provider';
import { HISTORY_REPOSITORY } from './history/history.interface';
import { HistoryService } from './history/history.service';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: SEARCH_PROVIDER,
      useClass: DuckDuckGoProvider,
    },
    {
      provide: HISTORY_REPOSITORY,
      useClass: HistoryService,
    },
  ],
})
export class SearchModule {}
