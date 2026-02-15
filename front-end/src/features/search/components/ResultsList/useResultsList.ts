import { useSearch, usePagination } from '@/features/search/hooks'
import { highlightText, type HighlightMatch } from '@/features/search/utils/highlight'
import type { SearchResult } from '@/features/search/model/search'

export interface HighlightedResult {
  result: SearchResult
  segments: HighlightMatch[]
}

export interface ResultsListViewProps {
  query: string
  isLoading: boolean
  error: string | null
  totalResults: number
  highlightedResults: HighlightedResult[]
  totalMatchCount: number
}

export function useResultsList(): ResultsListViewProps {
  const { query, isLoading, error, results } = useSearch()
  const { getPaginatedResults } = usePagination()
  const paginatedResults = getPaginatedResults()

  const highlightedResults: HighlightedResult[] = paginatedResults.map(
    (result) => {
      const { segments } = highlightText(result.title, query)
      return { result, segments }
    },
  )

  const totalMatchCount = highlightedResults.reduce((count, { result }) => {
    const { matchCount } = highlightText(result.title, query)
    return count + matchCount
  }, 0)

  return {
    query,
    isLoading,
    error,
    totalResults: results.length,
    highlightedResults,
    totalMatchCount,
  }
}
