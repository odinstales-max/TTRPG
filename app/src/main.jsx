import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AccountProvider } from './account.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>
)
