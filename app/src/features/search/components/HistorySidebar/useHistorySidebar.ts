import { useCallback, useEffect } from 'react'
import type { HistoryEntry } from '@/features/search/model/search'
import { useSearchStore } from '@/features/search/store/search.store'
import { useMediaQuery } from '@/shared/lib/hooks'

export interface HistorySidebarViewProps {
  history: HistoryEntry[]
  isHistoryLoading: boolean
  isDesktop: boolean
  isSheetOpen: boolean
  onSheetOpenChange: (open: boolean) => void
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
  onClearHistory: () => void
  onCloseSidebar: () => void
}

export function useHistorySidebar(): HistorySidebarViewProps {
  const history = useSearchStore((state) => state.history)
  const isHistoryLoading = useSearchStore((state) => state.isHistoryLoading)
  const search = useSearchStore((state) => state.search)
  const loadHistory = useSearchStore((state) => state.loadHistory)
  const isSidebarOpen = useSearchStore((state) => state.isSidebarOpen)
  const closeSidebar = useSearchStore((state) => state.closeSidebar)
  const removeHistoryEntry = useSearchStore((state) => state.removeHistoryEntry)
  const clearHistory = useSearchStore((state) => state.clearHistory)

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const onSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open) closeSidebar()
    },
    [closeSidebar],
  )

  const onHistoryClick = useCallback(
    (query: string) => {
      search(query)
      if (!isDesktop) closeSidebar()
    },
    [search, closeSidebar, isDesktop],
  )

  return {
    history,
    isHistoryLoading,
    isDesktop,
    isSheetOpen: isSidebarOpen,
    onSheetOpenChange,
    onHistoryClick,
    onRemoveEntry: removeHistoryEntry,
    onClearHistory: clearHistory,
    onCloseSidebar: closeSidebar,
  }
}
