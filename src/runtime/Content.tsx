import { RouteObject, useRoutes } from 'react-router-dom'

import Index from '../../docs/guide/Index'
import Foo from '../../docs/guide/Foo'
import Bar from '../../docs/Bar'

const routes: RouteObject[] = [
  {
    path: '/guide',
    element: <Index />,
  },
  {
    path: '/guide/a',
    element: <Foo />,
  },
  {
    path: '/b',
    element: <Bar />,
  },
]

const Content: React.FC = () => {
  const routeElement = useRoutes(routes)
  return routeElement
}

export default Content
