import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useSearch } from '@/features/search/hooks'
import { MAX_QUERY_LENGTH } from '@/features/search/model/search'

export interface SearchInputViewProps {
  inputValue: string
  isLoading: boolean
  isSubmitDisabled: boolean
  maxQueryLength: number
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
}

export function useSearchInput(): SearchInputViewProps {
  const { query, search, isLoading } = useSearch()
  const [inputValue, setInputValue] = useState(query)

  // Sync input when the store query changes externally (e.g., from history sidebar)
  useEffect(() => {
    setInputValue(query)
  }, [query])

  const onInputChange = useCallback((value: string) => {
    if (value.length > MAX_QUERY_LENGTH) return
    setInputValue(value)
  }, [])

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      if (inputValue.trim()) {
        search(inputValue.trim())
      }
    },
    [inputValue, search],
  )

  return {
    inputValue,
    isLoading,
    isSubmitDisabled: isLoading || !inputValue.trim(),
    maxQueryLength: MAX_QUERY_LENGTH,
    onInputChange,
    onSubmit,
  }
}
