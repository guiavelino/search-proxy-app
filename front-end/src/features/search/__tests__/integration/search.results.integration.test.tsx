import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@/shared/test/render'
import { ResultsList } from '@/features/search/components/ResultsList'
import { useSearchStore } from '@/features/search/store/search.store'
import { mockSearchResults } from '@/shared/test/mocks/handlers'
import { createSearchResult } from '@/shared/test/factories/search.factory'

describe('ResultsList (Integration)', () => {
  beforeEach(() => {
    useSearchStore.setState({
      query: '',
      results: [],
      history: [],
      currentPage: 1,
      isLoading: false,
      error: null,
    })
  })

  it('should render nothing when there are no results', () => {
    const { container } = render(<ResultsList />)
    expect(container.firstChild).toBeNull()
  })

  it('should show loading state', () => {
    useSearchStore.setState({ isLoading: true })
    render(<ResultsList />)

    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('should show error message', () => {
    useSearchStore.setState({ error: 'Something went wrong' })
    render(<ResultsList />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should display search results', () => {
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'react',
    })
    render(<ResultsList />)

    expect(screen.getByText('12 results found')).toBeInTheDocument()
  })

  it('should display paginated results (first page)', () => {
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'something',
      currentPage: 1,
    })
    render(<ResultsList />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('should highlight matching text in titles', () => {
    useSearchStore.setState({
      results: [createSearchResult({ title: 'React Tutorial', url: 'https://example.com' })],
      query: 'React',
    })
    render(<ResultsList />)

    const marks = screen.getAllByText('React')
    const highlighted = marks.find((el) => el.tagName === 'MARK')
    expect(highlighted).toBeDefined()
  })

  it('should show match counter when there are highlights', () => {
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'React',
    })
    render(<ResultsList />)

    const counter = screen.getByTestId('match-counter')
    expect(counter).toBeInTheDocument()
    expect(counter.textContent).toContain('highlighted on this page')
  })

  it('should render result URLs as links', () => {
    useSearchStore.setState({
      results: [createSearchResult({ title: 'Test Result', url: 'https://example.com' })],
      query: 'test',
    })
    render(<ResultsList />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
