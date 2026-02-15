import { describe, it, expect } from 'vitest'
import { highlightText } from '@/features/search/utils/highlight'

describe('highlightText', () => {
  it('should return the full text as a single non-highlighted segment when query is empty', () => {
    const result = highlightText('Hello World', '')
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })

  it('should return the full text as a single non-highlighted segment when query is whitespace', () => {
    const result = highlightText('Hello World', '   ')
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })

  it('should highlight a single occurrence of the query', () => {
    const result = highlightText('Hello World', 'World')
    expect(result.segments).toEqual([
      { text: 'Hello ', isHighlighted: false },
      { text: 'World', isHighlighted: true },
    ])
    expect(result.matchCount).toBe(1)
  })

  it('should highlight multiple occurrences of the query', () => {
    const result = highlightText('React is great. React is fast.', 'React')
    expect(result.matchCount).toBe(2)
    expect(result.segments[0]).toEqual({ text: 'React', isHighlighted: true })
    expect(result.segments[2]).toEqual({ text: 'React', isHighlighted: true })
  })

  it('should be case-insensitive', () => {
    const result = highlightText('React Tutorial', 'react')
    expect(result.segments[0]).toEqual({ text: 'React', isHighlighted: true })
    expect(result.matchCount).toBe(1)
  })

  it('should handle special regex characters in the query', () => {
    const result = highlightText('Price is $100 (USD)', '$100')
    expect(result.matchCount).toBe(1)
  })

  it('should return no highlights when query is not found', () => {
    const result = highlightText('Hello World', 'xyz')
    expect(result.segments).toEqual([
      { text: 'Hello World', isHighlighted: false },
    ])
    expect(result.matchCount).toBe(0)
  })
})
