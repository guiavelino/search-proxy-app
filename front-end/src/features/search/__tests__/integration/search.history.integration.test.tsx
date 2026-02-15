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
    // Act
    render(<HistorySidebar />)

    // Assert
    expect(screen.getByText('Search History')).toBeInTheDocument()
  })

  it('should show empty message when no history exists', async () => {
    // Arrange
    server.use(
      http.get('http://localhost:3000/search/history', () => {
        return HttpResponse.json([])
      }),
    )

    // Act
    render(<HistorySidebar />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('No search history yet.')).toBeInTheDocument()
    })
  })

  it('should load and display history from API', async () => {
    // Act
    render(<HistorySidebar />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })
  })

  it('should trigger a search when a history item is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<HistorySidebar />)
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    // Act
    await user.click(screen.getByText('react'))

    // Assert
    await waitFor(() => {
      expect(useSearchStore.getState().query).toBe('react')
    })
  })

  it('should display history items with formatted dates', async () => {
    // Act
    render(<HistorySidebar />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/)
    expect(dateElements.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    // Act
    render(<HistorySidebar />)

    // Assert
    expect(screen.getByLabelText('Search history')).toBeInTheDocument()
  })
})
