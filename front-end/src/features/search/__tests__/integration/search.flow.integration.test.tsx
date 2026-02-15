import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { useSearchStore } from '@/features/search/store/search-store'

describe('Search Flow (Integration)', () => {
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

  it('should complete a full search flow: type, submit, see results', async () => {
    const user = userEvent.setup()
    render(<App />)

    // 1. Type a query
    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react')

    // 2. Submit the form
    await user.click(screen.getByLabelText('Submit search'))

    // 3. Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })

    // 4. Verify results are paginated (only 5 visible in the results list)
    const allLists = screen.getAllByRole('list')
    const resultList = allLists.find(
      (list) => !list.closest('.history-sidebar'),
    )!
    const items = within(resultList).getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('should navigate between pages', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Search first
    await user.type(screen.getByLabelText('Search query'), 'react')
    await user.click(screen.getByLabelText('Submit search'))

    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })

    // Click page 2
    await user.click(screen.getByLabelText('Go to page 2'))

    // Verify page 2 is now active
    expect(screen.getByLabelText('Go to page 2')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('should highlight matching terms in results', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Search query'), 'React')
    await user.click(screen.getByLabelText('Submit search'))

    await waitFor(() => {
      expect(screen.getByTestId('match-counter')).toBeInTheDocument()
    })

    // Check that <mark> elements exist
    const marks = document.querySelectorAll('mark')
    expect(marks.length).toBeGreaterThan(0)
  })

  it('should load search history in sidebar', async () => {
    render(<App />)

    // History should load automatically
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })
  })

  it('should trigger search when clicking a history item', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Wait for history to load
    await waitFor(() => {
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })

    // Click on a history entry
    await user.click(screen.getByText('typescript'))

    // Should trigger a search and show results
    await waitFor(() => {
      expect(screen.getByText('12 results found')).toBeInTheDocument()
    })

    // The query store should be updated
    expect(useSearchStore.getState().query).toBe('typescript')
  })
})
