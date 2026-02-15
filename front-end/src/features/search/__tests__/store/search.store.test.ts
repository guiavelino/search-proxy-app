import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import {
  useSearchStore,
  RESULTS_PER_PAGE,
} from '@/features/search/store/search-store'
import { mockSearchResults } from '@/shared/test/mocks/handlers'
import { server } from '@/shared/test/mocks/server'

const API_BASE_URL = 'http://localhost:3000'

describe('useSearchStore', () => {
  beforeEach(() => {
    useSearchStore.setState({
      query: '',
      results: [],
      history: [],
      currentPage: 1,
      isLoading: false,
      error: null,
    })
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useSearchStore.getState()
      expect(state.query).toBe('')
      expect(state.results).toEqual([])
      expect(state.history).toEqual([])
      expect(state.currentPage).toBe(1)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setQuery', () => {
    it('should update the query', () => {
      useSearchStore.getState().setQuery('react')
      expect(useSearchStore.getState().query).toBe('react')
    })
  })

  describe('search', () => {
    it('should not search when query is empty', async () => {
      await useSearchStore.getState().search('')
      expect(useSearchStore.getState().results).toEqual([])
      expect(useSearchStore.getState().isLoading).toBe(false)
    })

    it('should not search when query is whitespace only', async () => {
      await useSearchStore.getState().search('   ')
      expect(useSearchStore.getState().results).toEqual([])
    })

    it('should fetch results and update state on successful search', async () => {
      await useSearchStore.getState().search('react')
      const state = useSearchStore.getState()
      expect(state.results).toEqual(mockSearchResults)
      expect(state.query).toBe('react')
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should reset currentPage to 1 on new search', async () => {
      useSearchStore.setState({ currentPage: 3 })
      await useSearchStore.getState().search('react')
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should set error state when API returns server error', async () => {
      server.use(
        http.get(`${API_BASE_URL}/search`, () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
          )
        }),
      )

      await useSearchStore.getState().search('react')
      const state = useSearchStore.getState()

      expect(state.error).toBe(
        'Failed to fetch search results. Please try again.',
      )
      expect(state.results).toEqual([])
      expect(state.isLoading).toBe(false)
    })

    it('should set error state when network fails', async () => {
      server.use(
        http.get(`${API_BASE_URL}/search`, () => {
          return HttpResponse.error()
        }),
      )

      await useSearchStore.getState().search('react')
      const state = useSearchStore.getState()

      expect(state.error).toBe(
        'Failed to fetch search results. Please try again.',
      )
      expect(state.results).toEqual([])
      expect(state.isLoading).toBe(false)
    })

    it('should discard stale responses when a newer search is triggered', async () => {
      // Simulate a slow first request
      server.use(
        http.get(`${API_BASE_URL}/search`, async ({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('q')

          if (query === 'slow') {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return HttpResponse.json([{ title: 'Slow Result', url: 'https://slow.com' }])
          }

          return HttpResponse.json([{ title: 'Fast Result', url: 'https://fast.com' }])
        }),
      )

      // Fire slow search, then immediately fire fast search
      const slowPromise = useSearchStore.getState().search('slow')
      const fastPromise = useSearchStore.getState().search('fast')

      await Promise.all([slowPromise, fastPromise])

      const state = useSearchStore.getState()
      // Should keep the fast (latest) result, not the slow (stale) one
      expect(state.query).toBe('fast')
      expect(state.results).toEqual([
        { title: 'Fast Result', url: 'https://fast.com' },
      ])
    })
  })

  describe('pagination', () => {
    beforeEach(async () => {
      await useSearchStore.getState().search('react')
    })

    it('should calculate total pages correctly', () => {
      const totalPages = useSearchStore.getState().getTotalPages()
      expect(totalPages).toBe(
        Math.ceil(mockSearchResults.length / RESULTS_PER_PAGE),
      )
    })

    it('should return the correct paginated results for page 1', () => {
      const paginated = useSearchStore.getState().getPaginatedResults()
      expect(paginated).toHaveLength(RESULTS_PER_PAGE)
      expect(paginated).toEqual(mockSearchResults.slice(0, RESULTS_PER_PAGE))
    })

    it('should return the correct paginated results for page 2', () => {
      useSearchStore.getState().setCurrentPage(2)
      const paginated = useSearchStore.getState().getPaginatedResults()
      expect(paginated).toEqual(
        mockSearchResults.slice(RESULTS_PER_PAGE, RESULTS_PER_PAGE * 2),
      )
    })

    it('should return remaining results for the last page', () => {
      const totalPages = useSearchStore.getState().getTotalPages()
      useSearchStore.getState().setCurrentPage(totalPages)
      const paginated = useSearchStore.getState().getPaginatedResults()
      const expectedStart = (totalPages - 1) * RESULTS_PER_PAGE
      expect(paginated).toEqual(mockSearchResults.slice(expectedStart))
    })

    it('should update current page', () => {
      useSearchStore.getState().setCurrentPage(2)
      expect(useSearchStore.getState().currentPage).toBe(2)
    })

    it('should ignore page below 1', () => {
      useSearchStore.getState().setCurrentPage(0)
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore negative page numbers', () => {
      useSearchStore.getState().setCurrentPage(-5)
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore page above total pages', () => {
      const totalPages = useSearchStore.getState().getTotalPages()
      useSearchStore.getState().setCurrentPage(totalPages + 1)
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore setCurrentPage when there are no results', () => {
      useSearchStore.setState({ results: [], currentPage: 1 })
      useSearchStore.getState().setCurrentPage(2)
      expect(useSearchStore.getState().currentPage).toBe(1)
    })
  })

  describe('loadHistory', () => {
    it('should load history from the API', async () => {
      await useSearchStore.getState().loadHistory()
      const state = useSearchStore.getState()
      expect(state.history).toHaveLength(2)
      expect(state.history[0].query).toBe('react')
      expect(state.history[1].query).toBe('typescript')
    })

    it('should keep existing history when API fails', async () => {
      // Load history first
      await useSearchStore.getState().loadHistory()
      expect(useSearchStore.getState().history).toHaveLength(2)

      // Make API fail
      server.use(
        http.get(`${API_BASE_URL}/search/history`, () => {
          return HttpResponse.error()
        }),
      )

      // Try loading again — should fail silently and keep old data
      await useSearchStore.getState().loadHistory()
      expect(useSearchStore.getState().history).toHaveLength(2)
    })
  })
})
