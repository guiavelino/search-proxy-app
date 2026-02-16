import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/features/search/components/Pagination'
import { useSearchStore } from '@/features/search/store/search.store'
import { mockSearchResults } from '@/shared/test/mocks/handlers'

describe('Pagination (Integration)', () => {
  beforeEach(() => {
    useSearchStore.setState({
      query: 'react',
      results: [],
      history: [],
      currentPage: 1,
      isLoading: false,
      isHistoryLoading: false,
      hasSearched: false,
      error: null,
    })
  })

  it('should render nothing when there are no results', () => {
    // Act
    const { container } = render(<Pagination />)

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when results fit in one page', () => {
    // Arrange
    useSearchStore.setState({ results: mockSearchResults.slice(0, 3) })

    // Act
    const { container } = render(<Pagination />)

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it('should render pagination when results span multiple pages', () => {
    // Arrange
    useSearchStore.setState({ results: mockSearchResults })

    // Act
    render(<Pagination />)

    // Assert
    expect(
      screen.getByLabelText('Search results pagination'),
    ).toBeInTheDocument()
  })

  it('should display page numbers', () => {
    // Arrange
    useSearchStore.setState({ results: mockSearchResults })

    // Act
    render(<Pagination />)

    // Assert
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should highlight the current page', () => {
    // Arrange
    useSearchStore.setState({ results: mockSearchResults, currentPage: 1 })

    // Act
    render(<Pagination />)

    // Assert
    expect(screen.getByLabelText('Go to page 1')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('should disable Previous button on first page', () => {
    // Arrange
    useSearchStore.setState({ results: mockSearchResults, currentPage: 1 })

    // Act
    render(<Pagination />)

    // Assert
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled()
  })

  it('should disable Next button on last page', () => {
    // Arrange
    const totalPages = Math.ceil(mockSearchResults.length / 5)
    useSearchStore.setState({
      results: mockSearchResults,
      currentPage: totalPages,
    })

    // Act
    render(<Pagination />)

    // Assert
    expect(screen.getByLabelText('Go to next page')).toBeDisabled()
  })

  it('should navigate to next page when Next is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    useSearchStore.setState({ results: mockSearchResults, currentPage: 1 })
    render(<Pagination />)

    // Act
    await user.click(screen.getByLabelText('Go to next page'))

    // Assert
    expect(useSearchStore.getState().currentPage).toBe(2)
  })

  it('should navigate to previous page when Previous is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    useSearchStore.setState({ results: mockSearchResults, currentPage: 2 })
    render(<Pagination />)

    // Act
    await user.click(screen.getByLabelText('Go to previous page'))

    // Assert
    expect(useSearchStore.getState().currentPage).toBe(1)
  })

  it('should navigate to a specific page when page number is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    useSearchStore.setState({ results: mockSearchResults, currentPage: 1 })
    render(<Pagination />)

    // Act
    await user.click(screen.getByLabelText('Go to page 3'))

    // Assert
    expect(useSearchStore.getState().currentPage).toBe(3)
  })
})
