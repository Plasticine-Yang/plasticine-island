import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import App from '../App'

function serverRender() {
  return renderToString(
    <StaticRouter location={'/guide'}>
      <App />
    </StaticRouter>,
  )
}

export { serverRender }
