import { useMemo } from 'react'
import { useSearchStore } from '@/features/search/store/search.store'
import { RESULTS_PER_PAGE } from '@/features/search/model/search'
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
  const query = useSearchStore((state) => state.query)
  const isLoading = useSearchStore((state) => state.isLoading)
  const error = useSearchStore((state) => state.error)
  const results = useSearchStore((state) => state.results)
  const hasSearched = useSearchStore((state) => state.hasSearched)
  const currentPage = useSearchStore((state) => state.currentPage)

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE
    return results.slice(start, start + RESULTS_PER_PAGE)
  }, [results, currentPage])

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
