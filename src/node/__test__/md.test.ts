import { describe, expect, test } from 'vitest'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import {
  rehypeCustomCodeBlockStructPlugin,
  rehypeHighlightCodeBlockPlugin,
} from '../../unified-plugins'

import shiki from 'shiki'

describe('Markdown compile cases', async () => {
  const processor = unified()
  processor
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeCustomCodeBlockStructPlugin)
    .use(rehypeHighlightCodeBlockPlugin, {
      highlighter: await shiki.getHighlighter({ theme: 'nord' }),
    })

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

  test('Compile code block', () => {
    const mdContent = '```ts\nconsole.log(666)\n```'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-ts\\"><span class=\\"lang\\">ts</span><pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">666</span><span style=\\"color: #D8DEE9FF\\">)</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `)
  })
})
