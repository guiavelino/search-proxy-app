import { describe, it, expect } from 'vitest'
import { computeVisiblePages } from '@/features/search/utils/search.pagination'

describe('computeVisiblePages', () => {
  it('should return all pages when totalPages is less than or equal to MAX_VISIBLE_PAGES', () => {
    // Act
    const result = computeVisiblePages(1, 3)

    // Assert
    expect(result).toEqual([1, 2, 3])
  })

  it('should return exactly MAX_VISIBLE_PAGES items when totalPages equals MAX_VISIBLE_PAGES', () => {
    // Act
    const result = computeVisiblePages(3, 5)

    // Assert
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('should return an empty array when totalPages is 0', () => {
    // Act
    const result = computeVisiblePages(1, 0)

    // Assert
    expect(result).toEqual([])
  })

  it('should center the window around the current page', () => {
    // Act
    const result = computeVisiblePages(5, 10)

    // Assert
    expect(result).toEqual([3, 4, 5, 6, 7])
  })

  it('should clamp the window to the start when current page is near the beginning', () => {
    // Act
    const result = computeVisiblePages(1, 10)

    // Assert
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('should clamp the window to the start when current page is 2', () => {
    // Act
    const result = computeVisiblePages(2, 10)

    // Assert
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('should clamp the window to the end when current page is near the last page', () => {
    // Act
    const result = computeVisiblePages(10, 10)

    // Assert
    expect(result).toEqual([6, 7, 8, 9, 10])
  })

  it('should clamp the window to the end when current page is second to last', () => {
    // Act
    const result = computeVisiblePages(9, 10)

    // Assert
    expect(result).toEqual([6, 7, 8, 9, 10])
  })

  it('should always return exactly MAX_VISIBLE_PAGES items for large page counts', () => {
    // Arrange & Act & Assert
    for (const page of [1, 12, 25, 50]) {
      const result = computeVisiblePages(page, 50)
      expect(result).toHaveLength(5)
    }
  })

  it('should handle single page', () => {
    // Act
    const result = computeVisiblePages(1, 1)

    // Assert
    expect(result).toEqual([1])
  })
})
