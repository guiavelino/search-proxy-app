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
      isHistoryLoading: false,
      hasSearched: false,
      error: null,
    })
  })

  it('should render nothing when no search has been performed', () => {
    // Act
    const { container } = render(<ResultsList />)

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it('should show "no results found" when search returns empty', () => {
    // Arrange
    useSearchStore.setState({
      query: 'nonexistent',
      results: [],
      hasSearched: true,
      isLoading: false,
    })

    // Act
    render(<ResultsList />)

    // Assert
    const emptyState = screen.getByRole('status')
    expect(emptyState).toHaveTextContent('No results found for')
    expect(emptyState).toHaveTextContent('nonexistent')
  })

  it('should show loading state', () => {
    // Arrange
    useSearchStore.setState({ isLoading: true })

    // Act
    render(<ResultsList />)

    // Assert
    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('should show error message', () => {
    // Arrange
    useSearchStore.setState({ error: 'Something went wrong' })

    // Act
    render(<ResultsList />)

    // Assert
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should display search results', () => {
    // Arrange
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'react',
      hasSearched: true,
    })

    // Act
    render(<ResultsList />)

    // Assert
    expect(screen.getByText('12 results found')).toBeInTheDocument()
  })

  it('should display paginated results (first page)', () => {
    // Arrange
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'something',
      hasSearched: true,
      currentPage: 1,
    })

    // Act
    render(<ResultsList />)

    // Assert
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('should highlight matching text in titles', () => {
    // Arrange
    useSearchStore.setState({
      results: [createSearchResult({ title: 'React Tutorial', url: 'https://example.com' })],
      query: 'React',
      hasSearched: true,
    })

    // Act
    render(<ResultsList />)

    // Assert
    const marks = screen.getAllByText('React')
    const highlighted = marks.find((el) => el.tagName === 'MARK')
    expect(highlighted).toBeDefined()
  })

  it('should show match counter when there are highlights', () => {
    // Arrange
    useSearchStore.setState({
      results: mockSearchResults,
      query: 'React',
      hasSearched: true,
    })

    // Act
    render(<ResultsList />)

    // Assert
    const counter = screen.getByTestId('match-counter')
    expect(counter).toBeInTheDocument()
    expect(counter.textContent).toContain('highlighted')
  })

  it('should render result URLs as links', () => {
    // Arrange
    useSearchStore.setState({
      results: [createSearchResult({ title: 'Test Result', url: 'https://example.com' })],
      query: 'test',
      hasSearched: true,
    })

    // Act
    render(<ResultsList />)

    // Assert
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
