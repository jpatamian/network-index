import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Posts from '../../features/posts/pages/Posts'
import { TestWrapper } from '../setup/test-wrapper'

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../lib/api', () => ({
  postsApi: {
    getAll: jest.fn(),
    getMine: jest.fn(),
  },
}))

import { useAuth } from '../../hooks/useAuth'
import { postsApi } from '../../lib/api'

describe('Posts Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.history.pushState({}, '', '/posts')
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
    })
    ;(postsApi.getAll as jest.Mock).mockResolvedValue([])
    ;(postsApi.getMine as jest.Mock).mockResolvedValue([])
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

  it('loads my posts when filter is set', async () => {
    window.history.pushState({}, '', '/posts?filter=mine')

    render(
      <TestWrapper>
        <Posts />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(postsApi.getMine).toHaveBeenCalledWith('mock-token')
    })
  })
})
