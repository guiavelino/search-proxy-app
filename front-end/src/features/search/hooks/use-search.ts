import { useSearchStore } from '@/features/search/store/search.store'

export function useSearch() {
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)
  const search = useSearchStore((state) => state.search)
  const isLoading = useSearchStore((state) => state.isLoading)
  const error = useSearchStore((state) => state.error)
  const results = useSearchStore((state) => state.results)

  return { query, setQuery, search, isLoading, error, results }
}
