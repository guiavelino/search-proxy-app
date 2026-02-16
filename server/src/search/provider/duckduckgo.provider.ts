import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { SearchResult } from '../search.types';
import type { SearchProvider } from './search-provider.interface';

interface DuckDuckGoTopic {
  Text?: string;
  FirstURL?: string;
}

interface DuckDuckGoTopicGroup {
  Name: string;
  Topics: DuckDuckGoTopic[];
}

interface DuckDuckGoResponse {
  RelatedTopics: (DuckDuckGoTopic | DuckDuckGoTopicGroup)[];
  Results: DuckDuckGoTopic[];
}

@Injectable()
export class DuckDuckGoProvider implements SearchProvider {
  private readonly baseUrl = 'https://api.duckduckgo.com/';

  async search(query: string): Promise<SearchResult[]> {
    const { data } = await axios.get<DuckDuckGoResponse>(this.baseUrl, {
      params: { q: query, format: 'json', no_html: 1 },
    });

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
