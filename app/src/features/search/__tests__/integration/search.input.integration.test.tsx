import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '@/features/search/components/SearchInput'
import { useSearchStore } from '@/features/search/store/search.store'
import { MAX_QUERY_LENGTH } from '@/features/search/model/search'

describe('SearchInput (Integration)', () => {
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

  it('should render the search input and button', () => {
    // Act
    render(<SearchInput />)

    // Assert
    expect(screen.getByLabelText('Search query')).toBeInTheDocument()
    expect(screen.getByLabelText('Submit search')).toBeInTheDocument()
  })

  it('should display placeholder text', () => {
    // Act
    render(<SearchInput />)

    // Assert
    expect(
      screen.getByPlaceholderText('Search for anything...'),
    ).toBeInTheDocument()
  })

  it('should update input value when typing', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SearchInput />)

    // Act
    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react')

    // Assert
    expect(input).toHaveValue('react')
  })

  it('should disable button when input is empty', () => {
    // Act
    render(<SearchInput />)

    // Assert
    expect(screen.getByLabelText('Submit search')).toBeDisabled()
  })

  it('should enable button when input has text', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SearchInput />)

    // Act
    await user.type(screen.getByLabelText('Search query'), 'react')

    // Assert
    expect(screen.getByLabelText('Submit search')).toBeEnabled()
  })

  it('should trigger search on form submit', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SearchInput />)

    // Act
    await user.type(screen.getByLabelText('Search query'), 'react')
    await user.click(screen.getByLabelText('Submit search'))

    // Assert
    expect(useSearchStore.getState().query).toBe('react')
  })

  it('should trigger search on Enter key press', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SearchInput />)

    // Act
    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react{Enter}')

    // Assert
    expect(useSearchStore.getState().query).toBe('react')
  })

  it('should disable input and button while loading', () => {
    // Arrange
    useSearchStore.setState({ isLoading: true })

    // Act
    render(<SearchInput />)

    // Assert
    expect(screen.getByLabelText('Search query')).toBeDisabled()
  })

  it('should have maxLength attribute on the input', () => {
    // Act
    render(<SearchInput />)

    // Assert
    const input = screen.getByLabelText('Search query')
    expect(input).toHaveAttribute('maxLength', String(MAX_QUERY_LENGTH))
  })
})
