import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { HistorySidebar } from '@/features/search/components/HistorySidebar'
import { useSearchStore } from '@/features/search/store/search.store'
import { server } from '@/shared/test/mocks/server'

describe('HistorySidebar (Integration)', () => {
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

  it('should render the sidebar with title', () => {
    render(<HistorySidebar />)

    expect(screen.getByText('Search History')).toBeInTheDocument()
  })

  it('should show empty message when no history exists', async () => {
    server.use(
      http.get('http://localhost:3000/search/history', () => {
        return HttpResponse.json([])
      }),
    )
    render(<HistorySidebar />)

    await waitFor(() => {
      expect(screen.getByText('No search history yet.')).toBeInTheDocument()
    })
  })

  it('should load and display history from API', async () => {
    render(<HistorySidebar />)

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })
  })

  it('should trigger a search when a history item is clicked', async () => {
    const user = userEvent.setup()
    render(<HistorySidebar />)

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    await user.click(screen.getByText('react'))

    await waitFor(() => {
      expect(useSearchStore.getState().query).toBe('react')
    })
  })

  it('should display history items with formatted dates', async () => {
    render(<HistorySidebar />)

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/)
    expect(dateElements.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    render(<HistorySidebar />)

    expect(screen.getByLabelText('Search history')).toBeInTheDocument()
  })
})
