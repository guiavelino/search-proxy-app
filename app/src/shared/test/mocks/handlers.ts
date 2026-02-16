import { http, HttpResponse } from 'msw'
import {
  createSearchResults,
  createHistoryEntry,
} from '@/shared/test/factories/search.factory'

const API_BASE_URL = 'http://localhost:3000'

export const mockSearchResults = createSearchResults(12)

export const mockHistory = [
  createHistoryEntry({ query: 'react', timestamp: '2025-01-01T00:00:00.000Z' }),
  createHistoryEntry({ query: 'typescript', timestamp: '2025-01-02T00:00:00.000Z' }),
]

export const handlers = [
  http.get(`${API_BASE_URL}/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')

    if (!query) {
      return HttpResponse.json(
        { message: 'Query parameter "q" is required' },
        { status: 400 },
      )
    }

    return HttpResponse.json(mockSearchResults)
  }),

  http.post(`${API_BASE_URL}/search`, async ({ request }) => {
    const body = (await request.json()) as { query?: string }

    if (!body.query) {
      return HttpResponse.json(
        { message: 'Field "query" is required' },
        { status: 400 },
      )
    }

    return HttpResponse.json(mockSearchResults)
  }),

  http.get(`${API_BASE_URL}/search/history`, () => {
    return HttpResponse.json(mockHistory)
  }),
]
