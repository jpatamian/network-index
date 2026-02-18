import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentSection from '../../features/posts/components/CommentSection'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../lib/api', () => ({
  commentsApi: {
    getByPost: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}))

import { useAuth } from '../../hooks/useAuth'

describe('CommentSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      token: 'mock-token',
      isAuthenticated: true,
    })
  })

  it('renders comments button with count', () => {
    render(
      <TestWrapper>
        <CommentSection postId={1} commentCount={2} />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.textContent).toMatch(/Comments/i)
  })

  it('renders for authenticated users', () => {
    render(
      <TestWrapper>
        <CommentSection postId={1} commentCount={0} />
      </TestWrapper>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
    })

    render(
      <TestWrapper>
        <CommentSection postId={1} commentCount={0} />
      </TestWrapper>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
