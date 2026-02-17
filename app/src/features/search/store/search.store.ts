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
  isSidebarOpen: boolean
}

interface SearchActions {
  search: (query: string) => Promise<void>
  setCurrentPage: (page: number) => void
  loadHistory: () => Promise<void>
  removeHistoryEntry: (index: number) => Promise<void>
  clearHistory: () => Promise<void>
  toggleSidebar: () => void
  closeSidebar: () => void
}

type SearchState = SearchData & SearchActions

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
  isSidebarOpen: false,

  search: async (query: string) => {
    if (!query.trim()) return

    searchInternals.activeSearchController?.abort()
    const controller = new AbortController()
    searchInternals.activeSearchController = controller

    const searchId = ++searchInternals.activeSearchId
    set({ isLoading: true, error: null, query, currentPage: 1, hasSearched: true })

    try {
      const results = await searchService.executeSearch(query, controller.signal)

      if (searchId !== searchInternals.activeSearchId) return

      set({ results, isLoading: false })
      void get().loadHistory()
    } catch {
      if (searchId !== searchInternals.activeSearchId) return

      set({ error: 'Failed to fetch search results. Please try again.', isLoading: false, results: [] })
    } finally {
      if (searchInternals.activeSearchController === controller) {
        searchInternals.activeSearchController = null
      }
    }
  },

  setCurrentPage: (page: number) => {
    const totalPages = Math.ceil(get().results.length / RESULTS_PER_PAGE)
    if (page < 1 || page > totalPages || totalPages === 0) return
    set({ currentPage: page })
  },

  loadHistory: async () => {
    set({ isHistoryLoading: true })
    try {
      const history = await searchService.getHistory()
      set({ history, isHistoryLoading: false })
    } catch {
      set({ isHistoryLoading: false })
    }
  },

  removeHistoryEntry: async (index: number) => {
    const previousHistory = get().history
    set({ history: previousHistory.filter((_, i) => i !== index) })

    try {
      await searchService.removeHistoryEntry(index)
    } catch {
      set({ history: previousHistory })
    }
  },

  clearHistory: async () => {
    const previousHistory = get().history
    set({ history: [] })

    try {
      await searchService.clearHistory()
    } catch {
      set({ history: previousHistory })
    }
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}))
