import { describe, it, expect } from 'vitest'
import { parseMarkdown } from '../../../src/renderer/src/lib/markdown-pipeline'

describe('parseMarkdown', () => {
  it('converts markdown to HTML', async () => {
    const { html } = await parseMarkdown('# Hello\n\nWorld')
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<p>World</p>')
  })

  it('extracts frontmatter', async () => {
    const md = '---\ntitle: Test\ndate: 2026-01-01\n---\n# Content'
    const { frontmatter } = await parseMarkdown(md)
    expect(frontmatter.title).toBe('Test')
    expect((frontmatter.date as Date).getFullYear()).toBe(2026)
  })

  it('renders GFM tables', async () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |'
    const { html } = await parseMarkdown(md)
    expect(html).toContain('<table>')
    expect(html).toContain('<td>1</td>')
  })

  it('renders math with KaTeX', async () => {
    const { html } = await parseMarkdown('$E=mc^2$')
    expect(html).toContain('katex')
  })

  it('adds highlight classes to fenced code blocks', async () => {
    const { html } = await parseMarkdown('```typescript\nconst x = 1\n```')
    expect(html).toContain('hljs')
  })

  it('converts [!NOTE] callouts', async () => {
    const { html } = await parseMarkdown('> [!NOTE]\n> Info here.')
    expect(html).toContain('callout-note')
  })

  it('returns empty frontmatter when no YAML block', async () => {
    const { frontmatter } = await parseMarkdown('# Just markdown')
    expect(frontmatter).toEqual({})
  })
})
