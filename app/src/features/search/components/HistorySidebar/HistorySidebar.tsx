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
}: HistorySidebarViewProps) {
  return (
    <aside className="history-sidebar" aria-label="Search history">
      <h2 className="history-sidebar__title">Search History</h2>
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
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
})
