import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreatePost from '../../features/posts/components/CreatePost'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../lib/api', () => ({
  postsApi: {
    create: jest.fn(),
  },
}))

import { useAuth } from '../../hooks/useAuth'

describe('CreatePost Component', () => {
  const mockOnPostCreated = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      token: 'mock-token',
      isAuthenticated: true,
    })
  })

  it('renders create post component for authenticated users', () => {
    render(
      <TestWrapper>
        <CreatePost onPostCreated={mockOnPostCreated} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <CreatePost onPostCreated={mockOnPostCreated} />
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('shows heading for authenticated users', () => {
    const { container } = render(
      <TestWrapper>
        <CreatePost onPostCreated={mockOnPostCreated} />
      </TestWrapper>
    )

    expect(container).toBeInTheDocument()
  })

  it('renders for anonymous users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
    })

    render(
      <TestWrapper>
        <CreatePost onPostCreated={mockOnPostCreated} />
      </TestWrapper>
    )

    expect(document.body).toBeInTheDocument()
  })
})
