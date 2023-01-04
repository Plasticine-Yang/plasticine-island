import viteReactPlugin from '@vitejs/plugin-react'

import {
  viteConventionalRoutesPlugin,
  viteLoadIndexHtmlPlugin,
  viteMDXPlugin,
  viteResolveConfigPlugin,
} from 'vite-plugins/index'

import type { SiteConfig } from 'types/index'

import { DEFAULT_TEMPLATE_PATH } from 'constants/index'

interface ResolveVitePluginsOptions {
  root: string
  resolvedSiteConfig: SiteConfig
  onResolveConfigPluginHotUpdate?: () => Promise<void>
}

function resolveVitePlugins(options: ResolveVitePluginsOptions) {
  const { root, resolvedSiteConfig, onResolveConfigPluginHotUpdate } = options

  return [
    viteReactPlugin(),
    viteLoadIndexHtmlPlugin(DEFAULT_TEMPLATE_PATH),
    viteResolveConfigPlugin(resolvedSiteConfig, onResolveConfigPluginHotUpdate),
    viteConventionalRoutesPlugin({ root }),
    viteMDXPlugin(),
  ]
}

export { resolveVitePlugins }
