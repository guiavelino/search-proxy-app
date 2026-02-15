import type { HistorySidebarViewProps } from './useHistorySidebar'
import './HistorySidebar.scss'

export function HistorySidebarView({
  history,
  onHistoryClick,
}: HistorySidebarViewProps) {
  return (
    <aside className="history-sidebar" aria-label="Search history">
      <h2 className="history-sidebar__title">Search History</h2>
      {history.length === 0 ? (
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
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
