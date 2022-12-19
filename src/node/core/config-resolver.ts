/** @description 配置解析器 */

import { loadConfig } from 'unconfig'

import { UserConfig } from '../../types/config'

async function resolveConfig(root: string) {
  const { config, sources } = await loadConfig<UserConfig>({
    sources: [
      {
        files: 'plasticine-island.config',
        extensions: ['ts', 'js'],
      },
    ],
    cwd: root,
  })

  return { config, sources }
}

function defineConfig(config: UserConfig): UserConfig {
  return config
}

export { resolveConfig, defineConfig }
