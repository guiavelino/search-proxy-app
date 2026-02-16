import { useMemo } from 'react'
import { useSearch, usePagination } from '@/features/search/hooks'
import { highlightText, type HighlightMatch } from '@/features/search/utils/search.highlight'
import type { SearchResult } from '@/features/search/model/search'

export interface HighlightedResult {
  result: SearchResult
  segments: HighlightMatch[]
  matchCount: number
}

export interface ResultsListViewProps {
  query: string
  isLoading: boolean
  error: string | null
  hasSearched: boolean
  totalResults: number
  highlightedResults: HighlightedResult[]
  totalMatchCount: number
}

export function useResultsList(): ResultsListViewProps {
  const { query, isLoading, error, results, hasSearched } = useSearch()
  const { paginatedResults } = usePagination()

  const { highlightedResults, totalMatchCount } = useMemo(() => {
    const accumulated = paginatedResults.reduce<{
      items: HighlightedResult[]
      count: number
    }>(
      (acc, result) => {
        const { segments, matchCount } = highlightText(result.title, query)
        acc.items.push({ result, segments, matchCount })
        acc.count += matchCount
        return acc
      },
      { items: [], count: 0 },
    )

    return {
      highlightedResults: accumulated.items,
      totalMatchCount: accumulated.count,
    }
  }, [paginatedResults, query])

  return {
    query,
    isLoading,
    error,
    hasSearched,
    totalResults: results.length,
    highlightedResults,
    totalMatchCount,
  }
}
