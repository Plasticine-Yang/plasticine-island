import { describe, expect, test } from 'vitest'

import { unified } from 'unified'

import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkMDX from 'remark-mdx'
import remarkStringify from 'remark-stringify'

import rehypeStringify from 'rehype-stringify'

import {
  rehypeCustomCodeBlockStructPlugin,
  rehypeHighlightCodeBlockPlugin,
  remarkTOCPlugin,
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

  test.only('Compile TOC', () => {
    const mdContent = `# h1

## text foo

### emphasis *foo* _bar_

#### strong **foo**

##### delete ~~foo~~

###### html <div>foo</div>

## inlineCode \`foo\` 

## image ![foo](https://example.com/favicon.ico "bar")

## imageReference ![foo][bar]

## link [foo](http://localhost:5173)

## linkReference [foo][bar]

## footnote [^foo]: bravo and charlie.

## footnoteReference [^foo]
`
    const remarkProcessor = unified()
      .use(remarkParse)
      .use(remarkMDX)
      .use(remarkTOCPlugin)
      .use(remarkStringify)
    const result = remarkProcessor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(`
      "# h1

      ## text foo

      ### emphasis *foo* *bar*

      #### strong **foo**

      ##### delete ~~foo~~

      ###### html <div>foo</div>

      ## inlineCode \`foo\`

      ## image ![foo](https://example.com/favicon.ico \\"bar\\")

      ## imageReference !\\\\[foo]\\\\[bar]

      ## link [foo](http://localhost:5173)

      ## linkReference \\\\[foo]\\\\[bar]

      ## footnote \\\\[^foo]: bravo and charlie.

      ## footnoteReference \\\\[^foo]

      export const toc = [
        {
          \\"id\\": \\"text-foo\\",
          \\"text\\": \\"text foo\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"emphasis-foo-bar\\",
          \\"text\\": \\"emphasis foo bar\\",
          \\"depth\\": 3
        },
        {
          \\"id\\": \\"strong-foo\\",
          \\"text\\": \\"strong foo\\",
          \\"depth\\": 4
        },
        {
          \\"id\\": \\"delete-foo\\",
          \\"text\\": \\"delete ~~foo~~\\",
          \\"depth\\": 5
        },
        {
          \\"id\\": \\"html-\\",
          \\"text\\": \\"html \\",
          \\"depth\\": 6
        },
        {
          \\"id\\": \\"inlinecode-foo\\",
          \\"text\\": \\"inlineCode foo\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"image-\\",
          \\"text\\": \\"image \\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"imagereference-foobar\\",
          \\"text\\": \\"imageReference ![foo][bar]\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"link-foo\\",
          \\"text\\": \\"link foo\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"linkreference-foobar\\",
          \\"text\\": \\"linkReference [foo][bar]\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"footnote-foo-bravo-and-charlie\\",
          \\"text\\": \\"footnote [^foo]: bravo and charlie.\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"footnotereference-foo\\",
          \\"text\\": \\"footnoteReference [^foo]\\",
          \\"depth\\": 2
        }
      ]
      "
    `)
  })
})
