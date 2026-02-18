import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Signup from '../../pages/Signup'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

import { useAuth } from '../../hooks/useAuth'

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      signup: jest.fn(),
      user: null,
      isAuthenticated: false,
    })
  })

  it('renders signup form', () => {
    render(
      <TestWrapper>
        <Signup />
      </TestWrapper>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/zipcode/i)).toBeInTheDocument()
  })

  it('renders signup heading', () => {
    const { container } = render(
      <TestWrapper>
        <Signup />
      </TestWrapper>
    )

    const heading = container.querySelector('h1')
    expect(heading).toBeInTheDocument()
  })

  it('has password input fields', () => {
    render(
      <TestWrapper>
        <Signup />
      </TestWrapper>
    )

    const passwordInputs = screen.getAllByPlaceholderText(/password/i)
    expect(passwordInputs.length).toBeGreaterThanOrEqual(1)
  })

  it('has submit button', () => {
    const { container } = render(
      <TestWrapper>
        <Signup />
      </TestWrapper>
    )

    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
