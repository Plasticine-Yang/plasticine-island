import { describe, expect, test } from 'vitest'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeCodeBlockPlugin } from '../../unified-plugins'

describe('Markdown compile cases', () => {
  const processor = unified()
  processor
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeCodeBlockPlugin)

  test('Compile title', () => {
    const mdContent = '# Hello World'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot('"<h1>Hello World</h1>"')
  })

  test('Compile inline code block', () => {
    const mdContent = 'I am using `plasticine-island`'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>plasticine-island</code></p>"',
    )
  })

  test.only('Compile code block', () => {
    const mdContent = '```ts\nconsole.log(666)\n```'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-ts\\"><span class=\\"lang\\">ts</span><pre><code class=\\"language-ts\\">console.log(666)
      </code></pre></div>"
    `)
  })
})
