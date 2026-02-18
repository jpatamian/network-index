import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../components/ui/provider'

interface TestWrapperProps {
  children: React.ReactNode
}

export function TestWrapper({ children }: TestWrapperProps) {
  return (
    <AppProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AppProvider>
  )
}
