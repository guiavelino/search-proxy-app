import { PaginationView } from './Pagination'
import { usePagination } from './usePagination'

export function Pagination() {
  const props = usePagination()
  return <PaginationView {...props} />
}
