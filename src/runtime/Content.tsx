import { useRoutes } from 'react-router-dom'

import { routes } from 'plasticine-island:conventional-routes'

const Content: React.FC = () => {
  const routeElement = useRoutes(routes)
  return routeElement
}

export default Content
