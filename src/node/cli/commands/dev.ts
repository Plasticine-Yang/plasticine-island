import { CAC } from 'cac'

import { createDevServer } from '../../core'

function registerDev(cli: CAC) {
  const action = async (root: string) => {
    const server = await createDevServer(root)
    server.listen()
    server.printUrls()
  }

  cli.command('dev <root>', 'Start a dev server.').action(action)
}

export { registerDev }
