import { SearchInput } from '@/features/search/components/SearchInput'
import { ResultsList } from '@/features/search/components/ResultsList'
import { Pagination } from '@/features/search/components/Pagination'
import { HistorySidebar } from '@/features/search/components/HistorySidebar'
import './App.scss'

export function App() {
  return (
    <div className="app">
      <HistorySidebar />
      <main className="app__main">
        <header className="app__header">
          <h1 className="app__title">Search Proxy</h1>
          <p className="app__subtitle">
            Search the web powered by DuckDuckGo
          </p>
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
