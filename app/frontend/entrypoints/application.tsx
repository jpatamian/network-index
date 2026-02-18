// Application entry point - initializes React, routing, and global providers
// AppProvider sets up Chakra UI and theme system for the entire app
// BrowserRouter enables client-side routing
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '@/components/ui/provider'
import App from '../App'
import './application.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)
