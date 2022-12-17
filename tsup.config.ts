import { defineConfig } from 'tsup'

import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  entry: [resolve(__dirname, 'src/node/cli/index.ts')],
  outDir: resolve(__dirname, 'dist'),
  format: ['cjs', 'esm'],
  bundle: true,
})
