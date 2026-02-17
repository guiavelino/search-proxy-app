import { memo } from 'react'
import type { HistorySidebarViewProps } from './useHistorySidebar'
import './HistorySidebar.scss'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
})

export const HistorySidebarView = memo(function HistorySidebarView({
  history,
  isHistoryLoading,
  onHistoryClick,
  onRemoveEntry,
  onClearHistory,
}: HistorySidebarViewProps) {
  return (
    <aside className="history-sidebar" aria-label="Search history">
      <div className="history-sidebar__header">
        <h2 className="history-sidebar__title">Search History</h2>
        {history.length > 0 && (
          <button
            className="history-sidebar__clear-btn"
            onClick={onClearHistory}
            title="Clear all history"
            aria-label="Clear all history"
          >
            Clear all
          </button>
        )}
      </div>
      {isHistoryLoading && history.length === 0 ? (
        <p className="history-sidebar__loading">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="history-sidebar__empty">No search history yet.</p>
      ) : (
        <ul className="history-sidebar__list" role="list">
          {history.map((entry, index) => (
            <li key={`${entry.query}-${index}`} className="history-sidebar__item">
              <button
                className="history-sidebar__button"
                onClick={() => onHistoryClick(entry.query)}
                title={`Search again: ${entry.query}`}
              >
                <span className="history-sidebar__query">{entry.query}</span>
                <span className="history-sidebar__time">
                  {dateFormatter.format(new Date(entry.timestamp))}
                </span>
              </button>
              <button
                className="history-sidebar__remove-btn"
                onClick={() => onRemoveEntry(index)}
                title={`Remove "${entry.query}" from history`}
                aria-label={`Remove "${entry.query}" from history`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
})
