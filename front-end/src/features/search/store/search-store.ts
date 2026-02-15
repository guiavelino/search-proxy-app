import { create } from 'zustand'
import type { SearchResult, HistoryEntry } from '@/features/search/model/search'
import { searchService } from '@/features/search/services/search.service'

const RESULTS_PER_PAGE = 5

interface SearchState {
  query: string
  results: SearchResult[]
  history: HistoryEntry[]
  currentPage: number
  isLoading: boolean
  error: string | null

  setQuery: (query: string) => void
  search: (query: string) => Promise<void>
  setCurrentPage: (page: number) => void
  loadHistory: () => Promise<void>
  getTotalPages: () => number
  getPaginatedResults: () => SearchResult[]
}

// Tracks the latest search request to discard stale responses
let activeSearchId = 0

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  history: [],
  currentPage: 1,
  isLoading: false,
  error: null,

  setQuery: (query: string) => set({ query }),

  search: async (query: string) => {
    if (!query.trim()) return

    const searchId = ++activeSearchId
    set({ isLoading: true, error: null, query, currentPage: 1 })

    try {
      const results = await searchService.executeSearch(query)

      // Discard if a newer search was triggered while this one was in-flight
      if (searchId !== activeSearchId) return

      set({ results, isLoading: false })

      // Reload history after a search (backend saves it) — fire-and-forget
      get().loadHistory()
    } catch {
      if (searchId !== activeSearchId) return

      set({
        error: 'Failed to fetch search results. Please try again.',
        isLoading: false,
        results: [],
      })
    }
  },

  setCurrentPage: (page: number) => {
    const totalPages = get().getTotalPages()
    if (page < 1 || page > totalPages || totalPages === 0) return
    set({ currentPage: page })
  },

  loadHistory: async () => {
    try {
      const history = await searchService.getHistory()
      set({ history })
    } catch {
      // Silently fail — history is non-critical
    }
  },

  getTotalPages: () => {
    const { results } = get()
    return Math.ceil(results.length / RESULTS_PER_PAGE)
  },

  getPaginatedResults: () => {
    const { results, currentPage } = get()
    const start = (currentPage - 1) * RESULTS_PER_PAGE
    return results.slice(start, start + RESULTS_PER_PAGE)
  },
}))

export { RESULTS_PER_PAGE }
