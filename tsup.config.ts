import { defineConfig } from 'tsup'

import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const r = (path: string) => resolve(__dirname, path)

export default defineConfig({
  entry: [r('src/node/cli/index.ts'), r('src/node/index.ts')],
  outDir: r('dist'),
  format: ['cjs', 'esm'],
  bundle: true,
  clean: true,
  dts: true,

  // inject cjs and esm shims
  shims: true,
})
