import { CAC } from 'cac'

function registerBuild(cli: CAC) {
  cli
    .command('build <root>', 'Build for production.')
    .action((root: string) => {
      console.log(`build: ${root}`)
    })
}

export { registerBuild }
