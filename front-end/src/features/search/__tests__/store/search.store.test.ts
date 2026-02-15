import { describe, it, expect, beforeEach } from 'vitest'
import {
  useSearchStore,
  RESULTS_PER_PAGE,
} from '@/features/search/store/search-store'
import { mockSearchResults } from '@/shared/test/mocks/handlers'

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
  })

  describe('loadHistory', () => {
    it('should load history from the API', async () => {
      await useSearchStore.getState().loadHistory()
      const state = useSearchStore.getState()
      expect(state.history).toHaveLength(2)
      expect(state.history[0].query).toBe('react')
      expect(state.history[1].query).toBe('typescript')
    })
  })
})
