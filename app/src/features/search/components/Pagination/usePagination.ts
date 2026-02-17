import { useCallback, useMemo } from 'react'
import { useSearchStore } from '@/features/search/store/search.store'
import { RESULTS_PER_PAGE, MAX_VISIBLE_PAGES } from '@/features/search/model/search'

export interface PaginationViewProps {
  isVisible: boolean
  currentPage: number
  totalPages: number
  visiblePages: number[]
  showLeftEllipsis: boolean
  showRightEllipsis: boolean
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

  const { visiblePages, showLeftEllipsis, showRightEllipsis } = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return {
        visiblePages: Array.from({ length: totalPages }, (_, i) => i + 1),
        showLeftEllipsis: false,
        showRightEllipsis: false,
      }
    }

    const half = Math.floor(MAX_VISIBLE_PAGES / 2)
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1)
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)

    return {
      visiblePages: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      showLeftEllipsis: start > 1,
      showRightEllipsis: end < totalPages,
    }
  }, [currentPage, totalPages])

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
    totalPages,
    visiblePages,
    showLeftEllipsis,
    showRightEllipsis,
    onPageChange: setCurrentPage,
    onPrevious,
    onNext,
  }
}
