import { SearchInput } from '@/features/search/components/SearchInput'
import { ResultsList } from '@/features/search/components/ResultsList'
import { Pagination } from '@/features/search/components/Pagination'
import { HistorySidebar } from '@/features/search/components/HistorySidebar'
import { useSearchStore } from '@/features/search/store/search.store'
import { Button } from '@/shared/components/ui/button'
import { Menu } from 'lucide-react'

export function App() {
  const toggleSidebar = useSearchStore((state) => state.toggleSidebar)

  return (
    <div className="flex min-h-screen bg-slate-50/80">
      <HistorySidebar />

      <main className="flex-1 min-w-0 px-4 py-8 sm:px-6 md:px-8 lg:px-12 lg:py-14 flex flex-col gap-8 lg:gap-10 w-full">
        <header>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden shrink-0 border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-white"
            onClick={toggleSidebar}
            aria-label="Toggle search history"
          >
            <Menu size={18} />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text">
              Search Proxy
            </h1>
            <p className="text-[0.8rem] text-slate-400 mt-0.5">
              Search the web powered by DuckDuckGo
            </p>
          </div>
        </header>

        <section className="w-full max-w-2xl mx-auto">
          <SearchInput />
        </section>

        <section className="w-full max-w-2xl mx-auto flex-1" aria-live="polite">
          <ResultsList />
          <Pagination />
        </section>
      </main>
    </div>
  )
}
