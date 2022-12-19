import { CAC } from 'cac'

import { createDevServer } from '../../core'

function registerDev(cli: CAC) {
  /**
   * @description dev 命令入口
   * @param root vite root -- 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径
   */
  const actionCallback = async (root: string) => {
    const _createDevServer = async () => {
      const server = await createDevServer(root, async () => {
        // restart when dev server hot update
        await server.close()
        await _createDevServer()
      })
      await server.listen()
      server.printUrls()
    }

    await _createDevServer()
  }

  cli.command('dev <root>', 'Start a dev server.').action(actionCallback)
}

export { registerDev }
