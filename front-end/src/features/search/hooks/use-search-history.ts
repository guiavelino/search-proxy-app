import { useEffect } from 'react'
import { useSearchStore } from '@/features/search/store/search.store'

export function useSearchHistory() {
  const history = useSearchStore((state) => state.history)
  const loadHistory = useSearchStore((state) => state.loadHistory)
  const search = useSearchStore((state) => state.search)

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const replaySearch = (query: string) => {
    search(query)
  }

  return { history, replaySearch }
}
