import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { describe, test, expect } from 'vitest'

import { RouteService } from './route-service'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('RouteService', () => {
  const testDir = resolve(__dirname, 'fixtures')
  const routeService = new RouteService(testDir)
  routeService.init()

  test('conventional route by file structure', () => {
    const routeMeta = routeService.getRouteMeta().map((item) => ({
      ...item,
      fileAbsPath: item.fileAbsPath.replace(testDir, 'TEST_DIR'),
    }))

    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "fileAbsPath": "TEST_DIR/foo.mdx",
          "routePath": "/foo",
        },
        {
          "fileAbsPath": "TEST_DIR/guide/bar.mdx",
          "routePath": "/guide/bar",
        },
        {
          "fileAbsPath": "TEST_DIR/index.mdx",
          "routePath": "/",
        },
      ]
    `)
  })

  test('generate routes code', () => {
    expect(routeService.generateRoutesCode().replaceAll(testDir, 'TEST_DIR'))
      .toMatchInlineSnapshot(`
      "import React from 'react'   
      import loadable from '@loadable/component'

      // 路由组件
      const Route0 = loadable(() => import('TEST_DIR/foo.mdx'))
      const Route1 = loadable(() => import('TEST_DIR/guide/bar.mdx'))
      const Route2 = loadable(() => import('TEST_DIR/index.mdx'))

      // routes 对象
      export const routes = [
        { path: '/foo', element: React.createElement(Route0) },
        { path: '/guide/bar', element: React.createElement(Route1) },
        { path: '/', element: React.createElement(Route2) }
      ]"
    `)
  })
})
