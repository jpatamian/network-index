import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../../features/auth/pages/Login'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(),
      user: null,
      isAuthenticated: false,
    })
  })

  it('renders login form', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it('renders login heading', () => {
    const { container } = render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const heading = container.querySelector('h1')
    expect(heading).toBeInTheDocument()
  })

  it('has form inputs', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it('has submit button', () => {
    const { container } = render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
