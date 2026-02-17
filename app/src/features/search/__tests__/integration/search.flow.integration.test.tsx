import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { useSearchStore } from '@/features/search/store/search.store'

describe('Search Flow (Integration)', () => {
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
      isSidebarOpen: false,
    })
  })

  it('should complete a full search flow: type, submit, see results', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<App />)

    // Act
    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react')
    await user.click(screen.getByLabelText('Submit search'))

    // Assert
    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })
    const resultList = screen.getAllByRole('list')[0]
    const items = within(resultList).getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('should navigate between pages', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Search query'), 'react')
    await user.click(screen.getByLabelText('Submit search'))
    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })

    // Act
    await user.click(screen.getByLabelText('Go to page 2'))

    // Assert
    expect(screen.getByLabelText('Go to page 2')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('should highlight matching terms in results', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<App />)

    // Act
    await user.type(screen.getByLabelText('Search query'), 'React')
    await user.click(screen.getByLabelText('Submit search'))

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('match-counter')).toBeInTheDocument()
    })
    const marks = document.querySelectorAll('mark')
    expect(marks.length).toBeGreaterThan(0)
  })

  it('should load search history in sidebar', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<App />)

    // Act — open sidebar (mobile mode in jsdom)
    await user.click(screen.getByLabelText('Toggle search history'))

    // Assert
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })
  })

  it('should trigger search when clicking a history item', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<App />)

    // Open sidebar first
    await user.click(screen.getByLabelText('Toggle search history'))
    await waitFor(() => {
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })

    // Act
    await user.click(screen.getByText('typescript'))

    // Assert
    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })
    expect(useSearchStore.getState().query).toBe('typescript')
  })
})
