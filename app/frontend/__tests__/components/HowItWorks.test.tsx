import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HowItWorks from '../../features/home/components/HowItWorks'
import { TestWrapper } from '../setup/test-wrapper'

describe('HowItWorks Component', () => {
  it('renders how it works heading', () => {
    const { container } = render(
      <TestWrapper>
        <HowItWorks />
      </TestWrapper>
    )

    const heading = container.querySelector('h2')
    expect(heading?.textContent).toContain('How It Works')
  })

  it('renders feature cards', () => {
    render(
      <TestWrapper>
        <HowItWorks />
      </TestWrapper>
    )

    expect(screen.getByText('Mutual Aid')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Neighborhood')).toBeInTheDocument()
    expect(screen.getByText('Safe & Secure')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(
      <TestWrapper>
        <HowItWorks />
      </TestWrapper>
    )

    expect(
      screen.getByText(/Connect with neighbors to share, help, and grow together/i)
    ).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <HowItWorks />
        </TestWrapper>
      )
    }).not.toThrow()
  })
})
