declare module 'plasticine-island:site-data' {
  import type { UserConfig } from 'types'
  const siteData: UserConfig
  export default siteData
}

declare module 'plasticine-island:conventional-routes' {
  import type { RouteObject } from 'react-router-dom'
  const routes: RouteObject[]
  export { routes }
}
