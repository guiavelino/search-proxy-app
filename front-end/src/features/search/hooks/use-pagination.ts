import { useSearchStore } from '@/features/search/store/search-store'

export function usePagination() {
  const currentPage = useSearchStore((state) => state.currentPage)
  const setCurrentPage = useSearchStore((state) => state.setCurrentPage)
  const getTotalPages = useSearchStore((state) => state.getTotalPages)
  const getPaginatedResults = useSearchStore((state) => state.getPaginatedResults)
  const results = useSearchStore((state) => state.results)

  const totalPages = getTotalPages()

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    results,
    getPaginatedResults,
  }
}
