import { memo } from 'react'
import { Search, X, Loader2, Trash2, Clock } from 'lucide-react'
import type { HistorySidebarViewProps } from './useHistorySidebar'
import type { HistoryEntry } from '@/features/search/model/search'
import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'

interface HistoryItemProps {
  entry: HistoryEntry
  index: number
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
}

const HistoryItem = memo(function HistoryItem({
  entry,
  index,
  onHistoryClick,
  onRemoveEntry,
}: HistoryItemProps) {
  return (
    <li className="group relative">
      <button
        className="w-full flex items-start gap-2.5 px-3 py-2.5 pr-9 bg-transparent rounded-lg cursor-pointer text-left transition-colors hover:bg-indigo-50/60"
        onClick={() => onHistoryClick(entry.query)}
        title={`Search again: ${entry.query}`}
      >
        <Search
          size={13}
          strokeWidth={2}
          className="text-slate-300 mt-0.5 shrink-0 group-hover:text-indigo-400 transition-colors"
        />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[0.8125rem] font-medium text-slate-700 truncate leading-tight group-hover:text-indigo-600 transition-colors">
            {entry.query}
          </span>
          <span className="text-[0.625rem] text-slate-400 leading-none tabular-nums tracking-wide flex items-center gap-1">
            <Clock size={8} className="shrink-0" />
            {format(new Date(entry.timestamp), 'dd/MM/yyyy - HH:mm:ss')}
          </span>
        </div>
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center text-slate-300 bg-transparent border-0 rounded-md cursor-pointer transition-all hover:text-red-500 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation()
          onRemoveEntry(index)
        }}
        title={`Remove "${entry.query}" from history`}
        aria-label={`Remove "${entry.query}" from history`}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </li>
  )
})

interface SidebarContentProps {
  history: HistoryEntry[]
  isHistoryLoading: boolean
  showCloseButton?: boolean
  onHistoryClick: (query: string) => void
  onRemoveEntry: (index: number) => void
  onClearHistory: () => void
  onClose?: () => void
}

function SidebarContent({
  history,
  isHistoryLoading,
  showCloseButton,
  onHistoryClick,
  onRemoveEntry,
  onClearHistory,
  onClose,
}: SidebarContentProps) {
  return (
    <>
      <div className="px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-indigo-500" />
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              History
            </h2>
            {history.length > 0 && (
              <span className="text-[0.625rem] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full font-semibold leading-none">
                {history.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 text-[0.625rem] gap-1"
                onClick={onClearHistory}
                title="Clear all history"
                aria-label="Clear all history"
              >
                <Trash2 size={10} />
                Clear
              </Button>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isHistoryLoading && history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 gap-2 flex-1">
          <Loader2 className="animate-spin text-slate-300" size={20} />
          <p className="text-xs text-slate-400 text-center">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 gap-2 flex-1">
          <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
            <Search size={18} strokeWidth={1.5} className="text-slate-300" />
          </div>
          <p className="text-xs font-medium text-slate-400 text-center">No search history yet.</p>
          <p className="text-[0.625rem] text-slate-300 text-center">Your searches will appear here</p>
        </div>
      ) : (
        <ul className="list-none px-2 py-2 m-0 flex flex-col gap-0.5 flex-1 overflow-y-auto" role="list">
          {history.map((entry, index) => (
            <HistoryItem
              key={`${entry.query}-${entry.timestamp}`}
              entry={entry}
              index={index}
              onHistoryClick={onHistoryClick}
              onRemoveEntry={onRemoveEntry}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export const HistorySidebarView = memo(function HistorySidebarView({
  history,
  isHistoryLoading,
  isDesktop,
  isSheetOpen,
  onSheetOpenChange,
  onHistoryClick,
  onRemoveEntry,
  onClearHistory,
  onCloseSidebar,
}: HistorySidebarViewProps) {
  const sharedProps = {
    history,
    isHistoryLoading,
    onHistoryClick,
    onRemoveEntry,
    onClearHistory,
  }

  if (isDesktop) {
    return (
      <aside
        className="w-64 min-w-64 h-screen sticky top-0 flex flex-col bg-white border-r border-slate-200/60"
        aria-label="Search history"
      >
        <SidebarContent {...sharedProps} />
      </aside>
    )
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[300px] sm:max-w-[300px] p-0 gap-0 flex flex-col bg-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Search History</SheetTitle>
          <SheetDescription>Browse and re-run your past searches</SheetDescription>
        </SheetHeader>
        <SidebarContent
          {...sharedProps}
          showCloseButton
          onClose={onCloseSidebar}
        />
      </SheetContent>
    </Sheet>
  )
})
