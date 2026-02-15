import type { ResultsListViewProps } from './useResultsList'
import './ResultsList.scss'

export function ResultsListView({
  isLoading,
  error,
  totalResults,
  highlightedResults,
  totalMatchCount,
}: ResultsListViewProps) {
  if (isLoading) {
    return (
      <div className="results-list__loading" role="status">
        <span className="results-list__spinner" />
        <p>Searching...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-list__error" role="alert">
        <p>{error}</p>
      </div>
    )
  }

  if (totalResults === 0) {
    return null
  }

  return (
    <div className="results-list">
      <div className="results-list__header">
        <span className="results-list__count">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </span>
        {totalMatchCount > 0 && (
          <span className="results-list__matches" data-testid="match-counter">
            {totalMatchCount} match{totalMatchCount !== 1 ? 'es' : ''} highlighted on this page
          </span>
        )}
      </div>
      <ul className="results-list__items" role="list">
        {highlightedResults.map(({ result, segments }, index) => (
          <li key={`${result.url}-${index}`} className="results-list__item">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="results-list__link"
            >
              <h3 className="results-list__title">
                {segments.map((segment, i) =>
                  segment.isHighlighted ? (
                    <mark key={i} className="results-list__highlight">
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={i}>{segment.text}</span>
                  ),
                )}
              </h3>
              <span className="results-list__url">{result.url}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
