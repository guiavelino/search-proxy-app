import { useCallback } from 'react'
import { useSearchHistory } from '@/features/search/hooks'
import type { HistoryEntry } from '@/features/search/model/search'
import { useSearchStore } from '@/features/search/store/search.store'

export interface HistorySidebarViewProps {
  history: HistoryEntry[]
  isHistoryLoading: boolean
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
  onClearHistory: () => void
}

export function useHistorySidebar(): HistorySidebarViewProps {
  const { history, isHistoryLoading, replaySearch } = useSearchHistory()
  const removeHistoryEntry = useSearchStore((state) => state.removeHistoryEntry)
  const clearHistory = useSearchStore((state) => state.clearHistory)

  const onRemoveEntry = useCallback(
    (index: number) => removeHistoryEntry(index),
    [removeHistoryEntry],
  )

  const onClearHistory = useCallback(() => clearHistory(), [clearHistory])

  return {
    history,
    isHistoryLoading,
    onHistoryClick: replaySearch,
    onRemoveEntry,
    onClearHistory,
  }
}
