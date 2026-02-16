import { httpClient } from '@/shared/lib/http'
import type { SearchResult, HistoryEntry } from '@/features/search/model/search'

export const searchService = {
  async executeSearch(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
    const { data } = await httpClient.get<SearchResult[]>('/search', {
      params: { q: query },
      signal,
    })
    return data
  },

  async getHistory(): Promise<HistoryEntry[]> {
    const { data } = await httpClient.get<HistoryEntry[]>('/search/history')
    return data
  },
}
