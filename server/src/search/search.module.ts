import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { FileHistoryService } from './history/file-history.service';
import { SEARCH_PROVIDER } from './provider/search-provider.interface';
import { DuckDuckGoProvider } from './provider/duckduckgo.provider';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    FileHistoryService,
    {
      provide: SEARCH_PROVIDER,
      useClass: DuckDuckGoProvider,
    },
  ],
})
export class SearchModule {}
