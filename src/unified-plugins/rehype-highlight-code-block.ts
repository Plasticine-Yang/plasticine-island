import type { Plugin } from 'unified'
import type { Root, Element, Text } from 'hast'
import { visit } from 'unist-util-visit'
import { fromHtml } from 'hast-util-from-html'

import type { Highlighter } from 'shiki'

import { ensureElementIsCodeBlock, extractCodeBlockLang } from './utils'

interface RehypeHighlightCodeBlockPluginOptions {
  highlighter: Highlighter
  theme?: string
}
const rehypeHighlightCodeBlockPlugin: Plugin<
  [RehypeHighlightCodeBlockPluginOptions],
  Root,
  Root
> = (options) => {
  const { highlighter } = options

  return (tree) => {
    visit(tree, 'element', (el, index, parent) => {
      if (ensureElementIsCodeBlock(el)) {
        // 提取代码内容和语言类型
        const codeEl = el.children.at(0) as Element
        const codeContent = (codeEl.children.at(0) as Text).value
        const lang = extractCodeBlockLang(codeEl)
        if (!lang) return

        // 传给 shiki 进行分词和生成带有样式的 html
        const highlightedCode = highlighter.codeToHtml(codeContent, { lang })

        // 再将高亮后的 html 字符串转回 hast
        const hast = fromHtml(highlightedCode, { fragment: true })

        // 用生成的 hast 节点替换原来的 hast 节点
        parent.children.splice(index, 1, ...hast.children)
      }
    })
  }
}

export { rehypeHighlightCodeBlockPlugin }
