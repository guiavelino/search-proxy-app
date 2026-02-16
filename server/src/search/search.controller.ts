import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchBodyDto } from './search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchByQuery(@Query() dto: SearchQueryDto) {
    return this.searchService.search(dto.q);
  }

  @Post()
  async searchByBody(@Body() dto: SearchBodyDto) {
    return this.searchService.search(dto.q);
  }

  @Get('history')
  async getHistory() {
    return this.searchService.getHistory();
  }
}
