import type { Element } from 'hast'

/**
 * @description 确保 el 是经 markdown 代码块转换而来的 hast Element
 * @param el hast Element
 * @param detactVisited 是否需要检测代码块元素是否已被遍历过
 */
function ensureElementIsCodeBlock(el: Element, detactVisited = false) {
  const firstChild = el.children.at(0)
  const isCodeBlockEl =
    el.tagName === 'pre' &&
    firstChild?.type === 'element' &&
    firstChild.tagName === 'code'

  const isVisited = el.data?.isVisited

  return detactVisited ? isCodeBlockEl && !isVisited : isCodeBlockEl
}

function extractCodeBlockLang(el: Element) {
  const codeClassName = el.properties?.className?.toString() || ''
  const lang = codeClassName.split('-')[1]

  return lang
}

export { ensureElementIsCodeBlock, extractCodeBlockLang }
