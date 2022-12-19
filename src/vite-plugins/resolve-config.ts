import type { Plugin } from 'vite'

import { SiteConfig } from '../types'

const siteDataId = 'plasticine-island:site-data'
const resolvedSiteDataId = '\0plasticine-island:site-data'

/**
 * @description 在浏览器端获取到配置文件中的数据
 * @param config SiteConfig
 */
function viteResolveConfigPlugin(config: SiteConfig): Plugin {
  const { siteData } = config

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
  }
}

export { viteResolveConfigPlugin }
