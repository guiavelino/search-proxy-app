export interface HighlightMatch {
  text: string
  isHighlighted: boolean
}

/**
 * Splits text into segments, marking parts that match the query for highlighting.
 * Returns an array of segments and the total count of matches.
 */
export function highlightText(
  text: string,
  query: string,
): { segments: HighlightMatch[]; matchCount: number } {
  if (!query.trim()) {
    return { segments: [{ text, isHighlighted: false }], matchCount: 0 }
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)
  let matchCount = 0

  const segments: HighlightMatch[] = parts
    .filter((part) => part !== '')
    .map((part) => {
      const isHighlighted = regex.test(part)
      regex.lastIndex = 0 // Reset regex state
      if (isHighlighted) matchCount++
      return { text: part, isHighlighted }
    })

  return { segments, matchCount }
}
