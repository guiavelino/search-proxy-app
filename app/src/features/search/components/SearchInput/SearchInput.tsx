import { memo } from 'react'
import type { SearchInputViewProps } from './useSearchInput'
import './SearchInput.scss'

export const SearchInputView = memo(function SearchInputView({
  inputValue,
  isLoading,
  isSubmitDisabled,
  maxQueryLength,
  onInputChange,
  onSubmit,
}: SearchInputViewProps) {
  return (
    <form className="search-input" onSubmit={onSubmit} role="search">
      <div className="search-input__wrapper">
        <input
          type="text"
          className="search-input__field"
          placeholder="Search for anything..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Search query"
          disabled={isLoading}
          maxLength={maxQueryLength}
        />
        <button
          type="submit"
          className="search-input__button"
          disabled={isSubmitDisabled}
          aria-label="Submit search"
        >
          {isLoading ? (
            <span className="search-input__spinner" aria-hidden="true" />
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  )
})
