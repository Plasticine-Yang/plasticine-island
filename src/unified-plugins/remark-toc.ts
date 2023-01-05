import type { Plugin } from 'unified'

import type { Root } from 'mdast'
import type { MdxjsEsm, Program } from 'mdast-util-mdxjs-esm'

import { visit } from 'unist-util-visit'

import GithubSlugger from 'github-slugger'

import { parse } from 'acorn'

const slugger = new GithubSlugger()

interface TOCItem {
  id: string
  text: string
  depth: number
}

const remarkTOCPlugin: Plugin<[], Root, Root> = () => {
  return (tree) => {
    const toc: TOCItem[] = []

    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children) return

      // 只提取 h2 ~ h6 的标题节点到 toc 中
      if (node.depth >= 2 && node.depth <= 6) {
        /**
         * node.children 可以分为三种情况：
         * 1. 有 value 属性的节点，如 text -- ## title
         * {
         *    type: 'text',
         *    value: 'title
         * }
         *
         * 2. 无 value 属性，但可以从 children 中获取 value 的节点，如 link -- ## [link](http://localhost:5173)
         * {
         *    type: 'link'
         *    url: 'http://localhost:5173'
         *    children: {
         *      type: 'text',
         *      value: 'link'
         *    }
         * }
         *
         * 3. 无 value 属性，且不能从 children 中获取 value 的节点，如 image -- ## image ![foo](https://example.com/favicon.ico "bar")
         * {
         *    type: 'image',
         *    alt: 'foo',
         *    title: 'bar',
         *    url: 'https://example.com/favicon.ico'
         * }
         *
         * 总的来说：
         *   有 value 属性的节点：text inlineCode
         *   无 value 属性，但能从 children 中获取 value 的节点：emphasis strong mdxJsxTextElement link
         *   无 value 属性，且不能从 children 中获取 value 的节点：image
         */
        const displayText = node.children
          .map((child) => {
            switch (child.type) {
              // 有 value 属性的节点
              case 'text':
              case 'inlineCode':
                return child.value

              // 无 value 属性，但能从 children 中获取 value 的节点
              case 'emphasis':
              case 'strong':
              case 'link':
                return child.children?.map((c) => c.value).join('') || ''

              // 无 value 属性，且不能从 children 中获取 value 的节点
              default:
                return ''
            }
          })
          .join('')
        const id = slugger.slug(displayText)

        toc.push({
          id,
          text: displayText,
          depth: node.depth,
        })
      }
    })

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)}`

    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module',
        }) as unknown as Program,
      },
    } as MdxjsEsm)
  }
}

export { remarkTOCPlugin }
