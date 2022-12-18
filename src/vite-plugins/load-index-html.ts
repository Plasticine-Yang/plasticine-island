import { Plugin } from 'vite'

import { readFile } from 'fs/promises'
import { CLIENT_ENTRY_PATH } from '../constants'

/**
 * @description 加载 html 到 vite dev server 实例中
 * @param templatePath html 文件的路径
 */
function viteLoadIndexHtmlPlugin(templatePath: string): Plugin {
  return {
    name: 'plasticine-island:load-index-html',
    apply: 'serve',

    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(templatePath, { encoding: 'utf-8' })

          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl,
            )

            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          } catch (error) {
            return next(error)
          }
        })
      }
    },

    /** @description 负责往 html 中注入加载 client-entry.tsx 的标签 */
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: 'body',
          },
        ],
      }
    },
  }
}

export { viteLoadIndexHtmlPlugin }
