import { useEffect, useState, type FormEvent } from 'react'
import { useSearch } from '@/features/search/hooks'

export interface SearchInputViewProps {
  inputValue: string
  isLoading: boolean
  isSubmitDisabled: boolean
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
}

export function useSearchInput(): SearchInputViewProps {
  const { query, setQuery, search, isLoading } = useSearch()
  const [inputValue, setInputValue] = useState(query)

  // Sync input when the store query changes externally (e.g., from history sidebar)
  useEffect(() => {
    setInputValue(query)
  }, [query])

  const onInputChange = (value: string) => {
    setInputValue(value)
    setQuery(value)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (inputValue.trim()) {
      search(inputValue.trim())
    }
  }

  return {
    inputValue,
    isLoading,
    isSubmitDisabled: isLoading || !inputValue.trim(),
    onInputChange,
    onSubmit,
  }
}
