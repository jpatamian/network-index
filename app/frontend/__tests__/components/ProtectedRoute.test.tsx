import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProtectedRoute from '../../components/ProtectedRoute'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

const TestComponent = () => <div>Protected Content</div>

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading message when checking authentication', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('does not show content when not authenticated and not loading', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </TestWrapper>
    )

    // Either redirects or doesn't show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
