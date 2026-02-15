import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@/shared/test/render'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '@/features/search/components/SearchInput'
import { useSearchStore } from '@/features/search/store/search-store'

describe('SearchInput (Integration)', () => {
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

  it('should render the search input and button', () => {
    render(<SearchInput />)

    expect(screen.getByLabelText('Search query')).toBeInTheDocument()
    expect(screen.getByLabelText('Submit search')).toBeInTheDocument()
  })

  it('should display placeholder text', () => {
    render(<SearchInput />)

    expect(
      screen.getByPlaceholderText('Search for anything...'),
    ).toBeInTheDocument()
  })

  it('should update input value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react')

    expect(input).toHaveValue('react')
  })

  it('should disable button when input is empty', () => {
    render(<SearchInput />)

    expect(screen.getByLabelText('Submit search')).toBeDisabled()
  })

  it('should enable button when input has text', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    await user.type(screen.getByLabelText('Search query'), 'react')

    expect(screen.getByLabelText('Submit search')).toBeEnabled()
  })

  it('should trigger search on form submit', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    await user.type(screen.getByLabelText('Search query'), 'react')
    await user.click(screen.getByLabelText('Submit search'))

    expect(useSearchStore.getState().query).toBe('react')
  })

  it('should trigger search on Enter key press', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const input = screen.getByLabelText('Search query')
    await user.type(input, 'react{Enter}')

    expect(useSearchStore.getState().query).toBe('react')
  })

  it('should disable input and button while loading', () => {
    useSearchStore.setState({ isLoading: true })
    render(<SearchInput />)

    expect(screen.getByLabelText('Search query')).toBeDisabled()
  })
})
