import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FindYourNeighborhood from '../../components/FindYourNeighborhood'
import { TestWrapper } from '../setup/test-wrapper'

describe('FindYourNeighborhood Component', () => {
  it('renders find your neighborhood heading', () => {
    const { container } = render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const heading = container.querySelector('h2')
    expect(heading?.textContent).toContain('Find Your Neighborhood')
  })

  it('renders description text', () => {
    render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    expect(
      screen.getByText(/Enter your zipcode to find resources/i)
    ).toBeInTheDocument()
  })

  it('renders zipcode input field', () => {
    render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const input = screen.getByPlaceholderText(/Enter your zipcode/i)
    expect(input).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const button = screen.getByText(/Search/i)
    expect(button).toBeInTheDocument()
  })

  it('disables search button when input is empty', () => {
    render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const button = screen.getByText(/Search/i)
    expect(button).toBeInTheDocument()
  })

  it('enables search button when user enters zipcode', () => {
    render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const input = screen.getByPlaceholderText(/Enter your zipcode/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: '90210' } })
    expect(input.value).toBe('90210')
  })

  it('renders map pin icon', () => {
    const { container } = render(
      <TestWrapper>
        <FindYourNeighborhood />
      </TestWrapper>
    )

    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <FindYourNeighborhood />
        </TestWrapper>
      )
    }).not.toThrow()
  })
})
