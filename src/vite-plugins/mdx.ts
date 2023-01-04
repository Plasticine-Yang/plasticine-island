import { Plugin } from 'vite'

import rollupMDXPlugin from '@mdx-js/rollup'

import remarkGFMPlugin from 'remark-gfm'
import remarkFrontmatterPlugin from 'remark-frontmatter'
import remarkMDXFrontmatterPlugin from 'remark-mdx-frontmatter'

import rehypeAutolinkHeadingPlugin from 'rehype-autolink-headings'
import rehypeSlugPlugin from 'rehype-slug'

function viteMDXPlugin(): Plugin {
  return rollupMDXPlugin({
    remarkPlugins: [
      // 支持 Github Flavoured Markdown 规范
      remarkGFMPlugin,
      // 支持在 `.md` 文件中使用 Front Matter
      remarkFrontmatterPlugin,
      // 支持在 `.mdx` 文件中使用 Front Matter
      [
        remarkMDXFrontmatterPlugin,
        {
          // 将 Front Matter 的数据放到名为 `frontmatter` 的对象里
          name: 'frontmatter',
        } as Parameters<typeof remarkMDXFrontmatterPlugin>['0'],
      ],
    ],
    rehypePlugins: [
      // 为 `<h1> ~ <h6>` 标签添加 id 属性
      rehypeSlugPlugin,
      [
        // 为带有 id 属性的 `<h1> ~ <h6>` 标签添加锚点
        rehypeAutolinkHeadingPlugin,
        {
          properties: {
            // 给标签添加 .heading-anchor 类名
            class: 'heading-anchor',
          },
          // 注入文本 hast 节点，文本内容为 `#`
          content: {
            type: 'text',
            value: '#',
          },
        } as Parameters<typeof rehypeAutolinkHeadingPlugin>['0'],
      ],
    ],
  })
}

export { viteMDXPlugin }
