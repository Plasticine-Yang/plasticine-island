import { Plugin } from 'vite'

import rollupMDXPlugin from '@mdx-js/rollup'

import remarkGFMPlugin from 'remark-gfm'
import remarkFrontmatterPlugin from 'remark-frontmatter'
import remarkMDXFrontmatterPlugin from 'remark-mdx-frontmatter'

import rehypeAutolinkHeadingPlugin from 'rehype-autolink-headings'
import rehypeSlugPlugin from 'rehype-slug'
import {
  rehypeCustomCodeBlockStructPlugin,
  rehypeHighlightCodeBlockPlugin,
  remarkTOCPlugin,
} from 'unified-plugins/index'

import shiki from 'shiki'

interface MDXPluginOptions {
  /** @description shiki highlighter -- 优先级更高 传入 highlighter 时会使用传入的 highlighter，忽略其他配置项 */
  highlighter?: shiki.Highlighter

  /** @description shiki theme */
  highlightTheme?: string
}
async function viteMDXPlugin(options: MDXPluginOptions = {}): Promise<Plugin> {
  const { highlighter } = await resolveDefaultOptions(options)

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
      // TOC
      remarkTOCPlugin,
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
      // 定制代码块的 html 结构
      rehypeCustomCodeBlockStructPlugin,
      // 代码高亮
      [
        rehypeHighlightCodeBlockPlugin,
        { highlighter } as Parameters<
          typeof rehypeHighlightCodeBlockPlugin
        >['0'],
      ],
    ],
  })
}

async function resolveDefaultOptions(
  options: MDXPluginOptions,
): Promise<Required<MDXPluginOptions>> {
  const highlightTheme = options.highlightTheme ?? 'nord'

  return {
    highlightTheme,
    highlighter:
      options.highlighter ??
      (await shiki.getHighlighter({ theme: highlightTheme })),
  }
}

export { viteMDXPlugin }
