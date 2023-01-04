import { build as viteBuild, InlineConfig } from 'vite'
import viteReactPlugin from '@vitejs/plugin-react'

import type { RollupOutput } from 'rollup'

import { resolve } from 'path'
import { rm, writeFile } from 'fs/promises'

import {
  CLIENT_ENTRY_BUNDLE_PATH,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_BUNDLE_PATH,
  SERVER_ENTRY_PATH,
} from '../../constants'

import { serverRender } from '../../runtime/server-entry'
import { SiteConfig } from 'types'
import {
  viteConventionalRoutesPlugin,
  viteResolveConfigPlugin,
} from 'vite-plugins'

interface ServerEntryModule {
  serverRender: typeof serverRender
}

async function build(root: string, config: SiteConfig) {
  // 1. 并行构建 client-entry 和 server-entry
  const [clientBundle] = await bundle(root, config)

  // 2. 引入 server-entry 构建产物
  const serverEntryBundlePath = resolve(
    root,
    SERVER_ENTRY_BUNDLE_PATH,
    'index.js',
  )
  const serverEntryModule: ServerEntryModule = await import(
    serverEntryBundlePath
  )

  // 3. 同构渲染
  //   3.1. 调用 server-entry 构建产物的 serverRender 函数，产出 html
  //   3.2. 将 client-entry 产物注入到生成的 html 中，完成 hydrate
  const { serverRender } = serverEntryModule
  await renderPage(root, serverRender, clientBundle)
}

/**
 * @description 构建 client-entry 和 server-entry
 * @returns [clientBundle, serverBundle]
 */
async function bundle(
  root: string,
  config: SiteConfig,
): Promise<[RollupOutput, RollupOutput]> {
  const resolveViteConfig = (type: 'client' | 'server'): InlineConfig => {
    const isServer = type === 'server'

    return {
      mode: 'production',
      root,
      plugins: [
        viteReactPlugin(),
        viteResolveConfigPlugin(config),
        viteConventionalRoutesPlugin({ root }),
      ],
      build: {
        ssr: isServer,
        outDir: isServer ? SERVER_ENTRY_BUNDLE_PATH : CLIENT_ENTRY_BUNDLE_PATH,
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: 'esm',
          },
        },
      },
    }
  }

  const buildClientEntry = () => {
    return viteBuild(resolveViteConfig('client'))
  }

  const buildServerEntry = () => {
    return viteBuild(resolveViteConfig('server'))
  }

  try {
    const [clientEntryBundle, serverEntryBundle] = (await Promise.all([
      buildClientEntry(),
      buildServerEntry(),
    ])) as [RollupOutput, RollupOutput]
    return [clientEntryBundle, serverEntryBundle]
  } catch (error) {
    console.error('build error:', error)
  }
}

/**
 * @description 同构渲染
 * @param serverRender 服务端渲染函数
 */
async function renderPage(
  root: string,
  serverRender: ServerEntryModule['serverRender'],
  clientBundle: RollupOutput,
) {
  // 获取 react-dom/server 处理的入口组件 APP 的 html
  const appHTML = serverRender()

  // 获取 client-entry 的入口 chunk
  const clientChunkEntry = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry,
  )

  // 将 appHTML 拼接到最终返回给浏览器的 html 中
  // 1. 拼接服务端渲染的 html
  // 2. hydrate 客户端的脚本
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>plasticine-island</title>
  </head>
  <body>
    <div id="root">${appHTML}</div>
    <script type="module" src="/${clientChunkEntry.fileName}"></script>
  </body>
</html> 
`.trim()

  // 写入到 client-entry bundle 的构建产物目录下
  await writeFile(resolve(root, CLIENT_ENTRY_BUNDLE_PATH, 'index.html'), html)

  // 移除 server-entry bundle 的构建产物目录
  await rm(resolve(root, SERVER_ENTRY_BUNDLE_PATH), {
    recursive: true,
    force: true,
  })
}

export { build }
