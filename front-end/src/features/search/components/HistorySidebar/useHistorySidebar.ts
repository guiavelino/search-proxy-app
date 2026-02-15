import { useSearchHistory } from '@/features/search/hooks'
import type { HistoryEntry } from '@/features/search/model/search'

export interface HistorySidebarViewProps {
  history: HistoryEntry[]
  onHistoryClick: (query: string) => void
}

export function useHistorySidebar(): HistorySidebarViewProps {
  const { history, replaySearch } = useSearchHistory()

  return {
    history,
    onHistoryClick: replaySearch,
  }
}
