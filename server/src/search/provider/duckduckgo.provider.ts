import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { SearchResult } from '../search.types';
import type { SearchProvider } from './search-provider.interface';
import type {
  DuckDuckGoResponse,
  DuckDuckGoTopic,
  DuckDuckGoTopicGroup,
} from './duckduckgo.types';

const REQUEST_TIMEOUT_MS = 10_000;

@Injectable()
export class DuckDuckGoProvider implements SearchProvider {
  private readonly logger = new Logger(DuckDuckGoProvider.name);
  private readonly baseUrl = 'https://api.duckduckgo.com/';

  async search(query: string): Promise<SearchResult[]> {
    try {
      const { data } = await axios.get<DuckDuckGoResponse>(this.baseUrl, {
        params: { q: query, format: 'json', no_html: 1 },
        timeout: REQUEST_TIMEOUT_MS,
      });

      return this.parseResponse(data);
    } catch (error) {
      this.logger.error(
        `Failed to fetch results for "${query}"`,
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(`Search provider failed for query "${query}"`);
    }
  }

  private parseResponse(data: DuckDuckGoResponse): SearchResult[] {
    const topics = this.flattenTopics(data.RelatedTopics ?? []);
    const all = [...(data.Results ?? []), ...topics];

    return all
      .filter(
        (item): item is DuckDuckGoTopic & { FirstURL: string; Text: string } =>
          Boolean(item.FirstURL && item.Text),
      )
      .map((item) => ({
        title: this.extractTitle(item.Text),
        url: item.FirstURL,
      }));
  }

  private flattenTopics(
    topics: (DuckDuckGoTopic | DuckDuckGoTopicGroup)[],
  ): DuckDuckGoTopic[] {
    return topics.flatMap((topic) =>
      'Topics' in topic ? topic.Topics : [topic],
    );
  }

  private extractTitle(text: string): string {
    const dashIndex = text.indexOf(' - ');
    return dashIndex > 0 ? text.substring(0, dashIndex) : text;
  }
}
