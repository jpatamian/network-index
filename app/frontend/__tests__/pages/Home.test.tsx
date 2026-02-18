import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/Home'
import { TestWrapper } from '../setup/test-wrapper'

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders welcome message for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByText('Welcome to Mutual Aid Club')).toBeInTheDocument()
    expect(
      screen.getByText(
        /A community networking platform for mutual aid and resource sharing/
      )
    ).toBeInTheDocument()
  })

  it('renders welcome back message for authenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', zipcode: '12345', anonymous: false },
      isAuthenticated: true,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByText('Welcome back, testuser!')).toBeInTheDocument()
  })

  it('displays signup and login buttons for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByRole('link', { name: /Get started/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('displays user profile for authenticated users', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      zipcode: '12345',
      anonymous: false,
    }

    ;(useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByText('Your Profile')).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(mockUser.username)).toBeInTheDocument()
    expect(screen.getByText(mockUser.zipcode)).toBeInTheDocument()
  })
})
