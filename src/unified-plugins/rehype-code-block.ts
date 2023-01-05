import type { Root, Element } from 'hast'
import type { Plugin } from 'unified'

import { visit } from 'unist-util-visit'
import { ensureElementIsCodeBlock } from './utils'

/**
 * @description 定制代码块的 html 结构
 */
const rehypeCodeBlockPlugin: Plugin<[], Root, Root> = () => {
  return (tree) => {
    visit(tree, 'element', (el) => {
      // 需要保证处理的元素是代码块对应的 hast 节点
      if (ensureElementIsCodeBlock(el, true)) {
        // 提取位于 code 标签中的 className -- 如 `language-ts`
        const className =
          (el.children.at(0) as Element).properties.className.toString() || ''

        // 创建 span 标签元素 标签内容为语言类型 -- 如 `language-ts` --> `ts`
        const language = className.split('-').at(1)!
        const spanEl = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'lang',
          },
          children: [
            {
              type: 'text',
              value: language,
            },
          ],
        } as Element

        // 克隆 pre 标签元素 -- 并将代码块元素标记为已处理过 避免后续再次遍历到时重复处理
        const clonedCodeBlockEl: Element = {
          type: 'element',
          tagName: 'pre',
          children: el.children,
          data: {
            isVisited: true,
          },
        }

        // 将代码块元素 pre 标签变为 div
        el.tagName = 'div'
        el.properties = el.properties ?? {}
        el.properties.className = className

        el.children = [spanEl, clonedCodeBlockEl]
      }
    })
  }
}

export { rehypeCodeBlockPlugin }
