import { SearchInput } from '@/features/search/components/SearchInput'
import { ResultsList } from '@/features/search/components/ResultsList'
import { Pagination } from '@/features/search/components/Pagination'
import { HistorySidebar } from '@/features/search/components/HistorySidebar'
import { useSearchStore } from '@/features/search/store/search.store'
import { Menu } from 'lucide-react'
import './App.scss'

export function App() {
  const toggleSidebar = useSearchStore((state) => state.toggleSidebar)

  return (
    <div className="app">
      <HistorySidebar />

      <main className="app__main">
        <header className="app__header">
          <button
            className="app__menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle search history"
          >
            <Menu size={22} />
          </button>
          <div className="app__header-text">
            <h1 className="app__title">Search Proxy</h1>
            <p className="app__subtitle">
              Search the web powered by DuckDuckGo
            </p>
          </div>
        </header>
        <section className="app__search">
          <SearchInput />
        </section>
        <section className="app__results" aria-live="polite">
          <ResultsList />
          <Pagination />
        </section>
      </main>
    </div>
  )
}
