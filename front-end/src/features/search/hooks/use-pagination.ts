import { useMemo } from 'react'
import { useSearchStore } from '@/features/search/store/search.store'
import { RESULTS_PER_PAGE } from '@/features/search/model/search'

export function usePagination() {
  const currentPage = useSearchStore((state) => state.currentPage)
  const setCurrentPage = useSearchStore((state) => state.setCurrentPage)
  const results = useSearchStore((state) => state.results)

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE)

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE
    return results.slice(start, start + RESULTS_PER_PAGE)
  }, [results, currentPage])

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    results,
    paginatedResults,
  }
}
