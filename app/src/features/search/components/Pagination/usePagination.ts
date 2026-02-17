import { useCallback, useMemo } from 'react'
import { useSearchStore } from '@/features/search/store/search.store'
import { RESULTS_PER_PAGE } from '@/features/search/model/search'
import { computeVisiblePages } from '@/features/search/utils/search.pagination'

export interface PaginationViewProps {
  isVisible: boolean
  currentPage: number
  visiblePages: number[]
  isPreviousDisabled: boolean
  isNextDisabled: boolean
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function usePagination(): PaginationViewProps {
  const currentPage = useSearchStore((state) => state.currentPage)
  const setCurrentPage = useSearchStore((state) => state.setCurrentPage)
  const results = useSearchStore((state) => state.results)

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE)
  const isVisible = results.length > 0 && totalPages > 1

  const visiblePages = useMemo(
    () => computeVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  )

  const onPageChange = useCallback(
    (page: number) => setCurrentPage(page),
    [setCurrentPage],
  )

  const onPrevious = useCallback(
    () => setCurrentPage(currentPage - 1),
    [currentPage, setCurrentPage],
  )

  const onNext = useCallback(
    () => setCurrentPage(currentPage + 1),
    [currentPage, setCurrentPage],
  )

  return {
    isVisible,
    currentPage,
    visiblePages,
    isPreviousDisabled: currentPage === 1,
    isNextDisabled: currentPage === totalPages,
    onPageChange,
    onPrevious,
    onNext,
  }
}
