import { HistorySidebarView } from './HistorySidebar'
import { useHistorySidebar } from './useHistorySidebar'

export function HistorySidebar() {
  const props = useHistorySidebar()
  return <HistorySidebarView {...props} />
}

export { HistorySidebarView }
