import { memo } from 'react'
import type { PaginationViewProps } from './usePagination'
import './Pagination.scss'

export const PaginationView = memo(function PaginationView({
  isVisible,
  currentPage,
  pages,
  isPreviousDisabled,
  isNextDisabled,
  onPageChange,
  onPrevious,
  onNext,
}: PaginationViewProps) {
  if (!isVisible) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Search results pagination">
      <button
        className="pagination__button"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      <div className="pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination__page ${
              page === currentPage ? 'pagination__page--active' : ''
            }`}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination__button"
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  )
})
