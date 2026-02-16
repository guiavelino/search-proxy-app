import { useSearchHistory } from '@/features/search/hooks'
import type { HistoryEntry } from '@/features/search/model/search'

export interface HistorySidebarViewProps {
  history: HistoryEntry[]
  isHistoryLoading: boolean
  onHistoryClick: (query: string) => void
}

export function useHistorySidebar(): HistorySidebarViewProps {
  const { history, isHistoryLoading, replaySearch } = useSearchHistory()

  return {
    history,
    isHistoryLoading,
    onHistoryClick: replaySearch,
  }
}
