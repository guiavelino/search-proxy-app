import { create } from 'zustand'
import type { SearchResult, HistoryEntry } from '@/features/search/model/search'
import { RESULTS_PER_PAGE } from '@/features/search/model/search'
import { searchService } from '@/features/search/services/search.service'

interface SearchData {
  query: string
  results: SearchResult[]
  history: HistoryEntry[]
  currentPage: number
  isLoading: boolean
  isHistoryLoading: boolean
  hasSearched: boolean
  error: string | null
}

interface SearchActions {
  setQuery: (query: string) => void
  search: (query: string) => Promise<void>
  setCurrentPage: (page: number) => void
  loadHistory: () => Promise<void>
  getTotalPages: () => number
  getPaginatedResults: () => SearchResult[]
}

type SearchState = SearchData & SearchActions

// Internal mutable state — not reactive, no re-renders needed
const searchInternals = {
  activeSearchId: 0,
  activeSearchController: null as AbortController | null,
}

export function resetSearchInternals() {
  searchInternals.activeSearchController?.abort()
  searchInternals.activeSearchId = 0
  searchInternals.activeSearchController = null
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  history: [],
  currentPage: 1,
  isLoading: false,
  isHistoryLoading: false,
  hasSearched: false,
  error: null,

  setQuery: (query: string) => set({ query }),

  search: async (query: string) => {
    if (!query.trim()) return

    // Cancel any in-flight request before starting a new one
    searchInternals.activeSearchController?.abort()
    const controller = new AbortController()
    searchInternals.activeSearchController = controller

    const searchId = ++searchInternals.activeSearchId
    set({ isLoading: true, error: null, query, currentPage: 1, hasSearched: true })

    try {
      const results = await searchService.executeSearch(query, controller.signal)

      // Discard if a newer search was triggered while this one was in-flight
      if (searchId !== searchInternals.activeSearchId) return

      set({ results, isLoading: false })

      // Reload history after a search (backend saves it) — fire-and-forget
      get().loadHistory()
    } catch {
      if (searchId !== searchInternals.activeSearchId) return

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
    set({ isHistoryLoading: true })
    try {
      const history = await searchService.getHistory()
      set({ history, isHistoryLoading: false })
    } catch {
      // Keep existing history on failure — non-critical data
      set({ isHistoryLoading: false })
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
