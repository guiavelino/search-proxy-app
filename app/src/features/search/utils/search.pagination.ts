import { MAX_VISIBLE_PAGES } from '@/features/search/model/search'

export function computeVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2)
  let start = currentPage - half
  let end = currentPage + half

  if (start < 1) {
    start = 1
    end = MAX_VISIBLE_PAGES
  }

  if (end > totalPages) {
    end = totalPages
    start = totalPages - MAX_VISIBLE_PAGES + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
