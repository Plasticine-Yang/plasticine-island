import { CAC } from 'cac'

function registerDev(cli: CAC) {
  cli.command('dev <root>', 'Start a dev server.').action((root: string) => {
    console.log(`dev: ${root}`)
  })
}

export { registerDev }
