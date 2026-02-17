import { ResultsListView } from './ResultsList'
import { useResultsList } from './useResultsList'

export function ResultsList() {
  const props = useResultsList()
  return <ResultsListView {...props} />
}
