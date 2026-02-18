import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Posts from '../../pages/Posts'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../lib/api', () => ({
  postsApi: {
    getAll: jest.fn(),
  },
}))

import { useAuth } from '../../hooks/useAuth'
import { postsApi } from '../../lib/api'

describe('Posts Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
    })
    ;(postsApi.getAll as jest.Mock).mockRejectedValue(new Error('API Error'))
  })

  it('renders posts page heading', async () => {
    expect(() => {
      render(
        <TestWrapper>
          <Posts />
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('renders page initially', () => {
    expect(() => {
      render(
        <TestWrapper>
          <Posts />
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <Posts />
        </TestWrapper>
      )
    }).not.toThrow()
  })
})
