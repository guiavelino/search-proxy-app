import { memo } from 'react'
import type { SearchInputViewProps } from './useSearchInput'
import { Button } from '@/shared/components/ui/button'
import { Search, Loader2 } from 'lucide-react'

export const SearchInputView = memo(function SearchInputView({
  inputValue,
  isLoading,
  isSubmitDisabled,
  maxQueryLength,
  onInputChange,
  onSubmit,
}: SearchInputViewProps) {
  return (
    <form className="w-full" onSubmit={onSubmit} role="search">
      <div className="flex items-center relative bg-white border border-slate-200 rounded-xl shadow-sm transition-all focus-within:border-indigo-400 focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] overflow-hidden">
        <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
        <input
          type="text"
          className="flex-1 min-w-0 pl-10 sm:pl-11 pr-3 py-3 sm:py-3.5 text-sm sm:text-[0.9375rem] bg-transparent border-0 outline-none text-slate-800 placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Search for anything..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Search query"
          disabled={isLoading}
          maxLength={maxQueryLength}
        />
        <Button
          type="submit"
          className="cursor-pointer rounded-none rounded-r-[11px] h-full px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isSubmitDisabled}
          aria-label="Submit search"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <span className="hidden sm:inline">Search</span>
              <Search className="sm:hidden" size={18} strokeWidth={2.5} />
            </>
          )}
        </Button>
      </div>
    </form>
  )
})
