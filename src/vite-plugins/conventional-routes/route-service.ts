import fg from 'fast-glob'
import { relative } from 'path'
import { normalizePath } from 'vite'

/**
 * @description 将文件系统转换成 RouteObject[]
 */

interface RouteMeta {
  /** @description 文件绝对路径 */
  fileAbsPath: string

  /** @description 路由路径 */
  routePath: string
}

class RouteService {
  #scanDir: string
  #routeMeta: RouteMeta[] = []

  constructor(scanDir: string) {
    this.#scanDir = scanDir
  }

  init() {
    const files = fg
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          'plasticine-island.config.ts',
          'plasticine-island.config.js',
        ],
      })
      .sort()

    files.forEach((file) => {
      // 生成文件的相对路径作为路由路径
      const fileRelativePath = normalizePath(relative(this.#scanDir, file))

      // 对路由路径进行标准化处理 -- 保证路由路径以 `/` 开头
      const routePath = this.normalizeRoutePath(fileRelativePath)

      // 补充路由元数据
      this.#routeMeta.push({
        fileAbsPath: file,
        routePath,
      })
    })
  }

  getRouteMeta(): RouteMeta[] {
    return this.#routeMeta
  }

  /**
   * @description 对文件相对路径进行处理转成路由路径
   * @param rawPath 文件相对于 this.#scanPath 的相对路径
   * @returns 相对路径标准化处理后的路由路径
   */
  normalizeRoutePath(rawPath: string) {
    // 将文件路径的后缀去除 -- index 作为默认路径
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '')

    // 确保路由路径以 `/` 开头
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }

  /**
   * @description 代码字符串生成 -- 供 vite 插件的 load 钩子返回
   */
  generateRoutesCode() {
    return `
import React from 'react'   
import loadable from '@loadable/component'

// 路由组件
${this.#routeMeta
  .map((route, index) => {
    return `const Route${index} = loadable(() => import('${route.fileAbsPath}'))`
  })
  .join('\n')}

// routes 对象
export const routes = [
${this.#routeMeta
  .map((route, index) => {
    return `  { path: '${route.routePath}', element: React.createElement(Route${index}) }`
  })
  .join(',\n')}
]
`.trim()
  }
}

export { RouteService }
