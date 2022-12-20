import { CAC } from 'cac'
import { resolveConfig } from 'node/core/config-resolver'
import { resolve } from 'path'

import { build } from '../../core/build'

function registerBuild(cli: CAC) {
  /**
   * @description build 命令入口
   * @param root vite root -- 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径
   */
  const actionCallback = async (root: string) => {
    try {
      const resolvedRoot = resolve(root)
      const config = await resolveConfig(resolvedRoot)
      await build(root, config)
    } catch (error) {
      console.error('build command action error:', error)
    }
  }

  cli.command('build <root>', 'Build for production.').action(actionCallback)
}

export { registerBuild }
