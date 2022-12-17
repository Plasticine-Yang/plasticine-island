import { renderToString } from 'react-dom/server'

import App from '../App'

function serverRender() {
  return renderToString(<App />)
}

export { serverRender }
