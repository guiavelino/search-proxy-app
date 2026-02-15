import { describe, it, expect } from 'vitest'
import { highlightText } from '@/features/search/utils/search.highlight'

describe('highlightText', () => {
  it('should return the full text as a single non-highlighted segment when query is empty', () => {
    // Act
    const result = highlightText('Hello World', '')

    // Assert
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })

  it('should return the full text as a single non-highlighted segment when query is whitespace', () => {
    // Act
    const result = highlightText('Hello World', '   ')

    // Assert
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })

  it('should highlight a single occurrence of the query', () => {
    // Act
    const result = highlightText('Hello World', 'World')

    // Assert
    expect(result.segments).toEqual([
      { text: 'Hello ', isHighlighted: false },
      { text: 'World', isHighlighted: true },
    ])
    expect(result.matchCount).toBe(1)
  })

  it('should highlight multiple occurrences of the query', () => {
    // Act
    const result = highlightText('React is great. React is fast.', 'React')

    // Assert
    expect(result.matchCount).toBe(2)
    expect(result.segments[0]).toEqual({ text: 'React', isHighlighted: true })
    expect(result.segments[2]).toEqual({ text: 'React', isHighlighted: true })
  })

  it('should be case-insensitive', () => {
    // Act
    const result = highlightText('React Tutorial', 'react')

    // Assert
    expect(result.segments[0]).toEqual({ text: 'React', isHighlighted: true })
    expect(result.matchCount).toBe(1)
  })

  it('should handle special regex characters in the query', () => {
    // Act
    const result = highlightText('Price is $100 (USD)', '$100')

    // Assert
    expect(result.matchCount).toBe(1)
  })

  it('should return no highlights when query is not found', () => {
    // Act
    const result = highlightText('Hello World', 'xyz')

    // Assert
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })
})
