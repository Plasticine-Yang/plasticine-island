/** @description 配置解析器 */

import { loadConfig } from 'unconfig'

import { SiteConfig, UserConfig } from 'types'

async function resolveConfig(root: string) {
  const { config: userConfig, sources } = await resolveUserConfig(root)
  const siteConfig: SiteConfig = {
    root,
    sources,
    siteData: resolveSiteData(userConfig),
  }

  return siteConfig
}

function resolveUserConfig(root: string) {
  return loadConfig<UserConfig>({
    sources: [
      {
        files: 'plasticine-island.config',
        extensions: ['ts', 'js'],
      },
    ],
    cwd: root,
  })
}

/** @description 为 UserConfig 配置默认值 */
function resolveSiteData(userConfig: UserConfig): UserConfig {
  const { title, description } = userConfig

  return {
    title: title ?? 'plasticine-island',
    description: description ?? 'A SSG framework powered by island',
  }
}

function defineConfig(config: UserConfig): UserConfig {
  return config
}

export { resolveConfig, defineConfig }
