import { createServer } from 'vite'

import { viteLoadIndexHtmlPlugin } from '../../vite-plugins'

import { DEFAULT_TEMPLATE_PATH } from '../../constants'

async function createDevServer(root: string) {
  const server = await createServer({
    configFile: false,
    root,
    plugins: [viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH)],
  })

  return server
}

export { createDevServer }
