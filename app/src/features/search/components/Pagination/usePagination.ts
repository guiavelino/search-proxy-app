import { useCallback, useMemo } from 'react'
import { usePagination as usePaginationState } from '@/features/search/hooks'

export interface PaginationViewProps {
  isVisible: boolean
  currentPage: number
  pages: number[]
  isPreviousDisabled: boolean
  isNextDisabled: boolean
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function usePagination(): PaginationViewProps {
  const { currentPage, setCurrentPage, totalPages, results } =
    usePaginationState()

  const isVisible = results.length > 0 && totalPages > 1

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
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
    pages,
    isPreviousDisabled: currentPage === 1,
    isNextDisabled: currentPage === totalPages,
    onPageChange,
    onPrevious,
    onNext,
  }
}
