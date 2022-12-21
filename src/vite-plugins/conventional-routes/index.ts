import type { Plugin } from 'vite'
import { RouteService } from './route-service'

const conventionalRoutesId = 'plasticine-island:conventional-routes'
const resolvedConventionalRoutesId = '\0plasticine-island:conventional-routes'

interface PluginConfig {
  root: string
}

function viteConventionalRoutesPlugin(config: PluginConfig): Plugin {
  const { root } = config
  const routeServices = new RouteService(root)

  return {
    name: conventionalRoutesId,

    configResolved() {
      // vite 配置解析完成时初始化 RouteService 对象
      routeServices.init()
    },

    resolveId(source) {
      if (source === conventionalRoutesId) {
        return resolvedConventionalRoutesId
      }
    },

    load(id) {
      if (id === resolvedConventionalRoutesId) {
        // 生成 react-router-dom 的路由配置对象
        return routeServices.generateRoutesCode()
      }
    },
  }
}

export { viteConventionalRoutesPlugin }
