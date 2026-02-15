import { PaginationView } from './Pagination'
import { usePaginationContainer } from './usePaginationContainer'

export function Pagination() {
  const props = usePaginationContainer()
  return <PaginationView {...props} />
}

export { PaginationView }
