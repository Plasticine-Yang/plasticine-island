import { existsSync } from 'fs'

import { execaCommandSync } from 'execa'
import type { SyncOptions } from 'execa'

import { E2E_PROJECT_PATH, PACKAGE_DIST_PATH, PACKAGE_ROOT } from './constants'

type DefaultExecaOptions = Pick<SyncOptions, 'stdin' | 'stdout' | 'stderr'>
const defaultExecaOptions: DefaultExecaOptions = {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
}

/**
 * @description 准备 e2e 测试环境
 */
function prepareE2E() {
  // 确保 plasticine-island 产物已经构建出来 -- 也就是确保 plasticine-island 命令能够执行
  if (!existsSync(PACKAGE_DIST_PATH)) {
    console.log('building plasticine-island...')
    execaCommandSync('pnpm build', {
      cwd: PACKAGE_ROOT,
      ...defaultExecaOptions,
    })
  }

  // 下载浏览器内核驱动
  console.log('playwright install...')
  execaCommandSync('npx playwright install', {
    cwd: PACKAGE_ROOT,
    ...defaultExecaOptions,
  })

  // install e2e project dependencies
  console.log('installing e2e project dependencies...')
  execaCommandSync('pnpm i', {
    cwd: E2E_PROJECT_PATH,
    ...defaultExecaOptions,
  })

  // start dev server
  execaCommandSync('pnpm dev', {
    cwd: E2E_PROJECT_PATH,
    ...defaultExecaOptions,
  })
}

prepareE2E()
