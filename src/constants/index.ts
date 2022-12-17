import { resolve } from 'path'

export const PACKAGE_ROOT = resolve(__dirname, '..')

/** @description dev server 默认加载的 html 模板文件路径 */
export const DEFAULT_TEMPLATE_PATH = resolve(PACKAGE_ROOT, 'template.html')

export const CLIENT_ENTRY_PATH = resolve(
  PACKAGE_ROOT,
  'src/runtime/client-entry/index.tsx',
)
