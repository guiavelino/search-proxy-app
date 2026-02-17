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
      isHistoryLoading: false,
      hasSearched: false,
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

  it('should not show clear button when history is empty', async () => {
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
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
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

  it('should show clear all button when history exists', async () => {
    // Act
    render(<HistorySidebar />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument()
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

  it('should remove a single history entry when remove button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<HistorySidebar />)
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    server.use(
      http.get('http://localhost:3000/search/history', () => {
        return HttpResponse.json([
          { query: 'typescript', timestamp: '2025-01-02T00:00:00.000Z' },
        ])
      }),
    )

    // Act
    const removeButtons = screen.getAllByLabelText(/Remove ".*" from history/)
    await user.click(removeButtons[0])

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('react')).not.toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })
  })

  it('should clear all history when clear all button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<HistorySidebar />)
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    // Act
    await user.click(screen.getByText('Clear all'))

    // Assert
    await waitFor(() => {
      expect(screen.getByText('No search history yet.')).toBeInTheDocument()
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

  it('should show loading state when history is being fetched', () => {
    // Arrange — pre-set loading state to test the view directly
    useSearchStore.setState({ isHistoryLoading: true, history: [] })

    // Act
    render(<HistorySidebar />)

    // Assert
    expect(screen.getByText('Loading history...')).toBeInTheDocument()
    expect(screen.queryByText('No search history yet.')).not.toBeInTheDocument()
  })
})
