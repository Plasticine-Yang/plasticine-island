import { CAC } from 'cac'

import { createDevServer } from '../../core'

function registerDev(cli: CAC) {
  /**
   * @description dev 命令入口
   * @param root vite root -- 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径
   */
  const actionCallback = async (root: string) => {
    const server = await createDevServer(root)
    await server.listen()
    server.printUrls()
  }

  cli.command('dev <root>', 'Start a dev server.').action(actionCallback)
}

export { registerDev }
