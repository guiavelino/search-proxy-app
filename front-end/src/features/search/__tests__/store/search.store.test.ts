import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import {
  useSearchStore,
  resetSearchInternals,
} from '@/features/search/store/search.store'
import { RESULTS_PER_PAGE } from '@/features/search/model/search'
import { mockSearchResults } from '@/shared/test/mocks/handlers'
import { server } from '@/shared/test/mocks/server'

const API_BASE_URL = 'http://localhost:3000'

describe('useSearchStore', () => {
  beforeEach(() => {
    resetSearchInternals()
    useSearchStore.setState({
      query: '',
      results: [],
      history: [],
      currentPage: 1,
      isLoading: false,
      isHistoryLoading: false,
      hasSearched: false,
      error: null,
    })
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      // Act
      const state = useSearchStore.getState()

      // Assert
      expect(state.query).toBe('')
      expect(state.results).toEqual([])
      expect(state.history).toEqual([])
      expect(state.currentPage).toBe(1)
      expect(state.isLoading).toBe(false)
      expect(state.isHistoryLoading).toBe(false)
      expect(state.hasSearched).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setQuery', () => {
    it('should update the query', () => {
      // Act
      useSearchStore.getState().setQuery('react')

      // Assert
      expect(useSearchStore.getState().query).toBe('react')
    })
  })

  describe('search', () => {
    it('should not search when query is empty', async () => {
      // Act
      await useSearchStore.getState().search('')

      // Assert
      expect(useSearchStore.getState().results).toEqual([])
      expect(useSearchStore.getState().isLoading).toBe(false)
    })

    it('should not search when query is whitespace only', async () => {
      // Act
      await useSearchStore.getState().search('   ')

      // Assert
      expect(useSearchStore.getState().results).toEqual([])
    })

    it('should fetch results and update state on successful search', async () => {
      // Act
      await useSearchStore.getState().search('react')

      // Assert
      const state = useSearchStore.getState()
      expect(state.results).toEqual(mockSearchResults)
      expect(state.query).toBe('react')
      expect(state.isLoading).toBe(false)
      expect(state.hasSearched).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should set hasSearched to true on search', async () => {
      // Arrange
      expect(useSearchStore.getState().hasSearched).toBe(false)

      // Act
      await useSearchStore.getState().search('react')

      // Assert
      expect(useSearchStore.getState().hasSearched).toBe(true)
    })

    it('should reset currentPage to 1 on new search', async () => {
      // Arrange
      useSearchStore.setState({ currentPage: 3 })

      // Act
      await useSearchStore.getState().search('react')

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should set error state when API returns server error', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/search`, () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
          )
        }),
      )

      // Act
      await useSearchStore.getState().search('react')

      // Assert
      const state = useSearchStore.getState()
      expect(state.error).toBe(
        'Failed to fetch search results. Please try again.',
      )
      expect(state.results).toEqual([])
      expect(state.isLoading).toBe(false)
    })

    it('should set error state when network fails', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/search`, () => {
          return HttpResponse.error()
        }),
      )

      // Act
      await useSearchStore.getState().search('react')

      // Assert
      const state = useSearchStore.getState()
      expect(state.error).toBe(
        'Failed to fetch search results. Please try again.',
      )
      expect(state.results).toEqual([])
      expect(state.isLoading).toBe(false)
    })

    it('should discard stale responses when a newer search is triggered', async () => {
      // Arrange
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

      // Act
      const slowPromise = useSearchStore.getState().search('slow')
      const fastPromise = useSearchStore.getState().search('fast')
      await Promise.all([slowPromise, fastPromise])

      // Assert
      const state = useSearchStore.getState()
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
      // Act
      const totalPages = useSearchStore.getState().getTotalPages()

      // Assert
      expect(totalPages).toBe(
        Math.ceil(mockSearchResults.length / RESULTS_PER_PAGE),
      )
    })

    it('should return the correct paginated results for page 1', () => {
      // Act
      const paginated = useSearchStore.getState().getPaginatedResults()

      // Assert
      expect(paginated).toHaveLength(RESULTS_PER_PAGE)
      expect(paginated).toEqual(mockSearchResults.slice(0, RESULTS_PER_PAGE))
    })

    it('should return the correct paginated results for page 2', () => {
      // Arrange
      useSearchStore.getState().setCurrentPage(2)

      // Act
      const paginated = useSearchStore.getState().getPaginatedResults()

      // Assert
      expect(paginated).toEqual(
        mockSearchResults.slice(RESULTS_PER_PAGE, RESULTS_PER_PAGE * 2),
      )
    })

    it('should return remaining results for the last page', () => {
      // Arrange
      const totalPages = useSearchStore.getState().getTotalPages()
      useSearchStore.getState().setCurrentPage(totalPages)

      // Act
      const paginated = useSearchStore.getState().getPaginatedResults()

      // Assert
      const expectedStart = (totalPages - 1) * RESULTS_PER_PAGE
      expect(paginated).toEqual(mockSearchResults.slice(expectedStart))
    })

    it('should update current page', () => {
      // Act
      useSearchStore.getState().setCurrentPage(2)

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(2)
    })

    it('should ignore page below 1', () => {
      // Act
      useSearchStore.getState().setCurrentPage(0)

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore negative page numbers', () => {
      // Act
      useSearchStore.getState().setCurrentPage(-5)

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore page above total pages', () => {
      // Arrange
      const totalPages = useSearchStore.getState().getTotalPages()

      // Act
      useSearchStore.getState().setCurrentPage(totalPages + 1)

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(1)
    })

    it('should ignore setCurrentPage when there are no results', () => {
      // Arrange
      useSearchStore.setState({ results: [], currentPage: 1 })

      // Act
      useSearchStore.getState().setCurrentPage(2)

      // Assert
      expect(useSearchStore.getState().currentPage).toBe(1)
    })
  })

  describe('loadHistory', () => {
    it('should load history from the API', async () => {
      // Act
      await useSearchStore.getState().loadHistory()

      // Assert
      const state = useSearchStore.getState()
      expect(state.history).toHaveLength(2)
      expect(state.history[0].query).toBe('react')
      expect(state.history[1].query).toBe('typescript')
      expect(state.isHistoryLoading).toBe(false)
    })

    it('should set isHistoryLoading during fetch', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/search/history`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.json([])
        }),
      )

      // Act
      const promise = useSearchStore.getState().loadHistory()

      // Assert — loading is true while request is in-flight
      expect(useSearchStore.getState().isHistoryLoading).toBe(true)

      await promise

      // Assert — loading is false after request completes
      expect(useSearchStore.getState().isHistoryLoading).toBe(false)
    })

    it('should keep existing history when API fails', async () => {
      // Arrange
      await useSearchStore.getState().loadHistory()
      expect(useSearchStore.getState().history).toHaveLength(2)

      server.use(
        http.get(`${API_BASE_URL}/search/history`, () => {
          return HttpResponse.error()
        }),
      )

      // Act
      await useSearchStore.getState().loadHistory()

      // Assert
      expect(useSearchStore.getState().history).toHaveLength(2)
      expect(useSearchStore.getState().isHistoryLoading).toBe(false)
    })
  })
})
