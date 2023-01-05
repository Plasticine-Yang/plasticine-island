import type { Root, Element } from 'hast'
import type { Plugin } from 'unified'

import { visit } from 'unist-util-visit'
import { ensureElementIsCodeBlock } from './utils'

/**
 * @description 定制代码块的 html 结构
 */
const rehypeCustomCodeBlockStructPlugin: Plugin<[], Root, Root> = () => {
  return (tree) => {
    visit(tree, 'element', (el, index, parent) => {
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

        // 创建 div 容器元素
        const divEl = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: className,
          },
          children: [spanEl, el],
        } as Element

        // 将代码块元素标记为已处理过 避免后续再次遍历到时重复处理
        el.data = {
          isVisited: true,
        }

        // 用 div hast 替换 el hast
        parent.children.splice(index, 1, divEl)
      }
    })
  }
}

export { rehypeCustomCodeBlockStructPlugin }
