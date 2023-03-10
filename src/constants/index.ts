import { resolve } from 'path'

export const PACKAGE_ROOT = resolve(__dirname, '..')

/** @description dev server 默认加载的 html 模板文件路径 */
export const DEFAULT_TEMPLATE_PATH = resolve(PACKAGE_ROOT, 'template.html')

export const CLIENT_ENTRY_PATH = resolve(
  PACKAGE_ROOT,
  'src/runtime/client-entry/index.tsx',
)

export const SERVER_ENTRY_PATH = resolve(
  PACKAGE_ROOT,
  'src/runtime/server-entry/index.tsx',
)

export const CLIENT_ENTRY_BUNDLE_PATH = 'dist'

export const SERVER_ENTRY_BUNDLE_PATH = '.temp'
