import { CAC } from 'cac'

function registerBuild(cli: CAC) {
  /**
   * @description build 命令入口
   * @param root vite root -- 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径
   */
  const actionCallback = () => {}

  cli.command('build <root>', 'Build for production.').action(actionCallback)
}

export { registerBuild }
