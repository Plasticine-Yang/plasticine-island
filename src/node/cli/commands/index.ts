import { CAC } from 'cac'

import { registerDev } from './dev'
import { registerBuild } from './build'

function registerCommands(cli: CAC) {
  registerDev(cli)
  registerBuild(cli)
}

export { registerCommands }
