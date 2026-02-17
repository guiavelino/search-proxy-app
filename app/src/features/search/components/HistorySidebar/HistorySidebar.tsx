import { memo, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import type { HistorySidebarViewProps } from './useHistorySidebar'
import type { HistoryEntry } from '@/features/search/model/search'
import { format } from 'date-fns'
import './HistorySidebar.scss'

interface HistoryItemProps {
  entry: HistoryEntry
  index: number
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
}

const HistoryItem = memo(function HistoryItem({
  entry,
  index,
  onHistoryClick,
  onRemoveEntry,
}: HistoryItemProps) {
  const handleClick = useCallback(
    () => onHistoryClick(entry.query),
    [onHistoryClick, entry.query],
  )

  const handleRemove = useCallback(
    () => onRemoveEntry(index),
    [onRemoveEntry, index],
  )

  return (
    <li className="history-sidebar__item">
      <button
        className="history-sidebar__button"
        onClick={handleClick}
        title={`Search again: ${entry.query}`}
      >
        <span className="history-sidebar__query">{entry.query}</span>
        <span className="history-sidebar__time">
          {format(new Date(entry.timestamp), 'dd/MM/yyyy - HH:mm:ss')}
        </span>
      </button>
      <button
        className="history-sidebar__remove-btn"
        onClick={handleRemove}
        title={`Remove "${entry.query}" from history`}
        aria-label={`Remove "${entry.query}" from history`}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </li>
  )
})

export const HistorySidebarView = memo(function HistorySidebarView({
  history,
  isHistoryLoading,
  isOpen,
  onHistoryClick,
  onRemoveEntry,
  onClearHistory,
  onClose,
}: HistorySidebarViewProps) {
  return (
    <>
      {isOpen && (
        <div className="history-sidebar__overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`history-sidebar ${isOpen ? 'history-sidebar--open' : ''}`}
        aria-label="Search history"
      >
        <div className="history-sidebar__header">
          <h2 className="history-sidebar__title">Search History</h2>
          <div className="history-sidebar__header-actions">
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
            <button
              className="history-sidebar__close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {isHistoryLoading && history.length === 0 ? (
          <div className="history-sidebar__empty-state">
            <div className="history-sidebar__spinner" />
            <p className="history-sidebar__loading">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-sidebar__empty-state">
            <Search size={40} strokeWidth={1.5} className="history-sidebar__empty-icon" />
            <p className="history-sidebar__empty">No search history yet.</p>
            <p className="history-sidebar__empty-hint">Your searches will appear here</p>
          </div>
        ) : (
          <ul className="history-sidebar__list" role="list">
            {history.map((entry, index) => (
              <HistoryItem
                key={`${entry.query}-${entry.timestamp}`}
                entry={entry}
                index={index}
                onHistoryClick={onHistoryClick}
                onRemoveEntry={onRemoveEntry}
              />
            ))}
          </ul>
        )}
      </aside>
    </>
  )
})
