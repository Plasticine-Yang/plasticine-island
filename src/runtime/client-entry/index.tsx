import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from '../App'

function renderInBrowser() {
  const rootEl = document.getElementById('root')
  if (!rootEl) {
    throw new Error('#root not found')
  }

  createRoot(rootEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}

renderInBrowser()
