import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto';
import type { SearchResult, HistoryEntry } from './search.types';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchByQuery(@Query() dto: SearchDto): Promise<SearchResult[]> {
    return this.searchService.search(dto.q);
  }

  @Post()
  async searchByBody(@Body() dto: SearchDto): Promise<SearchResult[]> {
    return this.searchService.search(dto.q);
  }

  @Get('history')
  async getHistory(): Promise<HistoryEntry[]> {
    return this.searchService.getHistory();
  }

  @Delete('history/:index')
  async removeHistoryEntry(
    @Param('index', ParseIntPipe) index: number,
  ): Promise<void> {
    return this.searchService.removeHistoryEntry(index);
  }

  @Delete('history')
  async clearHistory(): Promise<void> {
    return this.searchService.clearHistory();
  }
}
