import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Layout from '../../components/Layout'
import { TestWrapper } from '../setup/test-wrapper'

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders navigation with logo', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByText('Mutual Aid')).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Posts/i })).toBeInTheDocument()
  })

  it('displays login and signup buttons for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
  })

  it('displays user info and logout button for authenticated users', () => {
    const mockLogout = jest.fn()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', () => {
    const mockLogout = jest.fn()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })

  it('hides auth buttons while loading', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      logout: jest.fn(),
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Sign up/i })).not.toBeInTheDocument()
  })

  it('renders footer with copyright text', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    })

    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    )

    expect(screen.getByText(/© 2026 Mutual Aid Club/)).toBeInTheDocument()
  })
})
