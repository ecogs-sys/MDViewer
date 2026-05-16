import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import matter from 'gray-matter'
import { calloutsPlugin } from './callouts-plugin'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeHighlight)
  .use(rehypeKatex)
  .use(calloutsPlugin)
  .use(rehypeStringify, { allowDangerousHtml: true })

export interface ParsedMarkdown {
  html: string
  frontmatter: Record<string, unknown>
}

export async function parseMarkdown(raw: string): Promise<ParsedMarkdown> {
  const { data: frontmatter, content } = matter(raw)
  const result = await processor.process(content)
  return { html: String(result), frontmatter }
}
