import { relative } from 'path'
import type { Plugin } from 'vite'

import { SiteConfig } from '../types'

const siteDataId = 'plasticine-island:site-data'
const resolvedSiteDataId = '\0plasticine-island:site-data'

/**
 * @description 在浏览器端获取到配置文件中的数据
 * @param config SiteConfig
 */
function viteResolveConfigPlugin(
  config: SiteConfig,
  onRestart: () => Promise<void>,
): Plugin {
  const { root, siteData, sources } = config

  return {
    name: 'plasticine-island:config',
    resolveId(source) {
      if (source === siteDataId) {
        return resolvedSiteDataId
      }
    },

    load(id) {
      if (id === resolvedSiteDataId) {
        return `export default ${JSON.stringify(siteData)}`
      }
    },

    /** @description 配置文件更新时热更新重启开发服务器 */
    async handleHotUpdate(ctx) {
      const shouldHotUpdate = (file: string) =>
        sources.some((configFilePath) => file.includes(configFilePath))

      if (shouldHotUpdate(ctx.file)) {
        console.log(
          `\n${relative(root, ctx.file)} changed, restarting dev server...\n`,
        )
        await onRestart()
      }
    },
  }
}

export { viteResolveConfigPlugin }
