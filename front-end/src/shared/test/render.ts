import { render, type RenderOptions } from '@testing-library/react'
import { createElement, Fragment, type ReactElement } from 'react'

/**
 * Custom render that wraps components with all required providers.
 * Extend AllProviders as the app grows (e.g., Router, ThemeProvider).
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return createElement(Fragment, null, children)
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from RTL so tests import from a single source
export * from '@testing-library/react'
export { customRender as render }
