import { createServer } from 'vite'

import viteReactPlugin from '@vitejs/plugin-react'

import {
  viteLoadIndexHtmlPlugin,
  viteResolveConfigPlugin,
} from '../../vite-plugins'

import { DEFAULT_TEMPLATE_PATH, PACKAGE_ROOT } from '../../constants'
import { resolveConfig } from './config-resolver'

async function createDevServer(root: string) {
  const config = await resolveConfig(root)

  const server = await createServer({
    configFile: false,
    root,
    plugins: [
      viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH),
      viteReactPlugin(),
      viteResolveConfigPlugin(config),
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  })

  return server
}

export { createDevServer }
