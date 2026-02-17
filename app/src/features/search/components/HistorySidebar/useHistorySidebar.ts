import { useCallback, useEffect } from 'react'
import type { HistoryEntry } from '@/features/search/model/search'
import { useSearchStore } from '@/features/search/store/search.store'

// Matches $breakpoint-lg in _variables.scss
const DESKTOP_BREAKPOINT = 1024

export interface HistorySidebarViewProps {
  history: HistoryEntry[]
  isHistoryLoading: boolean
  isOpen: boolean
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
  onClearHistory: () => void
  onClose: () => void
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

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const onHistoryClick = useCallback(
    (query: string) => {
      search(query)
      closeSidebar()
    },
    [search, closeSidebar],
  )

  // Close sidebar on Escape key
  useEffect(() => {
    if (!isSidebarOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen, closeSidebar])

  // Lock body scroll when sidebar is open on non-desktop screens
  useEffect(() => {
    if (!isSidebarOpen) return

    const isNonDesktop = window.innerWidth < DESKTOP_BREAKPOINT
    if (!isNonDesktop) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isSidebarOpen])

  return {
    history,
    isHistoryLoading,
    isOpen: isSidebarOpen,
    onHistoryClick,
    onRemoveEntry: removeHistoryEntry,
    onClearHistory: clearHistory,
    onClose: closeSidebar,
  }
}
