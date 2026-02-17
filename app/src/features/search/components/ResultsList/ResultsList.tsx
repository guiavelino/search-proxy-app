import { memo } from 'react'
import type { ResultsListViewProps } from './useResultsList'
import { Loader2 } from 'lucide-react'

export const ResultsListView = memo(function ResultsListView({
  query,
  isLoading,
  error,
  hasSearched,
  totalResults,
  highlightedResults,
  totalMatchCount,
}: ResultsListViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-slate-400" role="status">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <p className="text-sm">Searching...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 bg-red-50 border border-red-100 rounded-xl" role="alert">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (totalResults === 0) {
    if (hasSearched) {
      return (
        <div className="text-center py-16 text-slate-400" role="status">
          <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <span className="text-xs text-slate-400 font-medium">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </span>
        {totalMatchCount > 0 && (
          <span
            className="text-[0.7rem] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full"
            data-testid="match-counter"
          >
            {totalMatchCount} match{totalMatchCount !== 1 ? 'es' : ''} highlighted
          </span>
        )}
      </div>

      <ul className="list-none p-0 m-0 flex flex-col gap-2" role="list">
        {highlightedResults.map(({ result, segments }, index) => (
          <li
            key={`${result.url}-${index}`}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md"
          >
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 no-underline text-inherit"
            >
              <h3 className="text-[0.875rem] font-semibold text-slate-800 mb-1 leading-snug">
                {segments.map((segment, i) =>
                  segment.isHighlighted ? (
                    <mark key={i} className="bg-yellow-100 text-amber-800 px-0.5 rounded-sm font-bold">
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={i}>{segment.text}</span>
                  ),
                )}
              </h3>
              <span className="text-xs text-indigo-500/70 break-all leading-relaxed">{result.url}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})
