import { usePagination } from '@/features/search/hooks'

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

export function usePaginationContainer(): PaginationViewProps {
  const { currentPage, setCurrentPage, totalPages, results } = usePagination()

  const isVisible = results.length > 0 && totalPages > 1
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return {
    isVisible,
    currentPage,
    pages,
    isPreviousDisabled: currentPage === 1,
    isNextDisabled: currentPage === totalPages,
    onPageChange: setCurrentPage,
    onPrevious: () => setCurrentPage(currentPage - 1),
    onNext: () => setCurrentPage(currentPage + 1),
  }
}
