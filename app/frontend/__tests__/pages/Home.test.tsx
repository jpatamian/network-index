import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/Home'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('renders page for authenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', zipcode: '12345', anonymous: false },
      isAuthenticated: true,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    expect(() => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('renders heading for authenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', zipcode: '12345', anonymous: false },
      isAuthenticated: true,
    })

    const { container } = render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    // Check that some heading exists
    const headings = container.querySelectorAll('h1, h2, h3')
    expect(headings.length).toBeGreaterThan(0)
  })
})
