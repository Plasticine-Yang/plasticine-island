import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const PACKAGE_ROOT = resolve(__dirname, '..')

/** @description e2e 测试项目 */
export const E2E_PROJECT_PATH = resolve(PACKAGE_ROOT, 'e2e/playground/basic')

/** @description plasticine-island 产物目录 */
export const PACKAGE_DIST_PATH = resolve(PACKAGE_ROOT, 'dist')
