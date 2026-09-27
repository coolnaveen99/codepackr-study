import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './mobile-tokens.css'

// Polyfill crypto.randomUUID for older Safari / non-secure contexts
try {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(crypto as any).randomUUID = function randomUUID(): string {
      return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`
    }
  }
} catch {
  /* ignore */
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
