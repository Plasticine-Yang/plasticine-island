import { createServer } from 'vite'

import { PACKAGE_ROOT } from '../../constants'
import { resolveConfig } from './config-resolver'
import { resolveVitePlugins } from './utils'

async function createDevServer(
  root: string,
  onResolveConfigPluginHotUpdate: () => Promise<void>,
) {
  const config = await resolveConfig(root)

  const server = await createServer({
    configFile: false,
    root: PACKAGE_ROOT,
    plugins: resolveVitePlugins({
      root,
      resolvedSiteConfig: config,
      onResolveConfigPluginHotUpdate,
    }),
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  })

  return server
}

export { createDevServer }
