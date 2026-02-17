import { memo } from 'react'
import type { PaginationViewProps } from './usePagination'
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/shared/components/ui/pagination'

export const PaginationView = memo(function PaginationView({
  isVisible,
  currentPage,
  totalPages,
  visiblePages,
  showLeftEllipsis,
  showRightEllipsis,
  onPageChange,
  onPrevious,
  onNext,
}: PaginationViewProps) {
  if (!isVisible) {
    return null
  }

  return (
    <PaginationRoot className="mt-6" aria-label="Search results pagination">
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrevious}
            className={currentPage === 1 ? 'pointer-events-none opacity-30' : 'cursor-pointer hover:bg-slate-100'}
            aria-disabled={currentPage === 1}
            aria-label="Go to previous page"
          />
        </PaginationItem>

        {showLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                className="cursor-pointer hover:bg-slate-100 text-slate-600"
                aria-label="Go to page 1"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              className={
                page === currentPage
                  ? 'bg-indigo-700 text-white border-indigo-700 hover:bg-indigo-700 cursor-default'
                  : 'cursor-pointer hover:bg-slate-100 text-slate-600'
              }
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                className="cursor-pointer hover:bg-slate-100 text-slate-600"
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={onNext}
            className={currentPage === totalPages ? 'pointer-events-none opacity-30' : 'cursor-pointer hover:bg-slate-100'}
            aria-disabled={currentPage === totalPages}
            aria-label="Go to next page"
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
})
