import { describe, expect, test } from 'vitest'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

describe('Markdown compile cases', () => {
  const processor = unified()
  processor.use(remarkParse).use(remarkRehype).use(rehypeStringify)

  test('Compile title', () => {
    const mdContent = '# Hello World'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot('"<h1>Hello World</h1>"')
  })

  test('Compile code block', () => {
    const mdContent = 'I am using `plasticine-island`'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>plasticine-island</code></p>"',
    )
  })
})
