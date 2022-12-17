import cac from 'cac'

import { registerCommands } from './commands'

const setupCLI = () => {
  const cli = cac('plasticine-island')

  registerCommands(cli)

  cli.help()
  cli.version('1.0.0')
  cli.parse()
}

setupCLI()
