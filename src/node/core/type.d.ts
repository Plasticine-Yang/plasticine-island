import { serverRender } from '../../runtime/server-entry'

interface ServerEntryModule {
  serverRender: typeof serverRender
}

export { ServerEntryModule }
