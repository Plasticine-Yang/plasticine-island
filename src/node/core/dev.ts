import { createServer } from 'vite'

async function createDevServer(root: string) {
  const server = await createServer({
    configFile: false,
    root,
  })

  return server
}

export { createDevServer }
