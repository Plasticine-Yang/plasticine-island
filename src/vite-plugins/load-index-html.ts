import { Plugin } from 'vite'

import { readFile } from 'fs/promises'

/**
 * @description 加载 html 到 vite dev server 实例中
 * @param templatePath html 文件的路径
 */
function viteLoadIndexHtmlPlugin(templatePath: string): Plugin {
  return {
    name: 'plasticine-island:load-index-html',

    configureServer(server) {
      server.middlewares.use(async (_, res) => {
        const html = await readFile(templatePath, { encoding: 'utf-8' })

        res.setHeader('Content-Type', 'text/html')
        res.end(html)
      })
    },
  }
}

export { viteLoadIndexHtmlPlugin }
