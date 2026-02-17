import { SearchInputView } from './SearchInput'
import { useSearchInput } from './useSearchInput'

export function SearchInput() {
  const props = useSearchInput()
  return <SearchInputView {...props} />
}
