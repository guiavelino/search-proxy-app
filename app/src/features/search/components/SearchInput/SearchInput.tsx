import { memo } from 'react'
import type { SearchInputViewProps } from './useSearchInput'
import { Search } from 'lucide-react'
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
        <Search className="search-input__icon" size={20} />
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
            <>
              <span className="search-input__button-text">Search</span>
              <Search className="search-input__button-icon" size={20} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </form>
  )
})
