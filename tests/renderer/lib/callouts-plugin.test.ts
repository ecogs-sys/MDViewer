import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { calloutsPlugin } from '../../../src/renderer/src/lib/callouts-plugin'

async function process(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(calloutsPlugin)
    .use(rehypeStringify)
    .process(md)
  return String(result)
}

describe('calloutsPlugin', () => {
  it('transforms [!NOTE] blockquote into a callout div', async () => {
    const html = await process('> [!NOTE]\n> This is a note.')
    expect(html).toContain('class="callout callout-note"')
    expect(html).toContain('callout-title')
    expect(html).toContain('NOTE')
  })

  it('transforms [!WARNING] blockquote', async () => {
    const html = await process('> [!WARNING]\n> Watch out.')
    expect(html).toContain('callout-warning')
  })

  it('transforms [!TIP] blockquote', async () => {
    const html = await process('> [!TIP]\n> Helpful tip.')
    expect(html).toContain('callout-tip')
  })

  it('transforms [!IMPORTANT] blockquote', async () => {
    const html = await process('> [!IMPORTANT]\n> Key info.')
    expect(html).toContain('callout-important')
  })

  it('leaves regular blockquotes untouched', async () => {
    const html = await process('> A plain quote.')
    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('callout')
  })

  it('removes the [!TYPE] prefix from the body text', async () => {
    const html = await process('> [!NOTE]\n> This is a note.')
    expect(html).not.toContain('[!NOTE]')
    expect(html).toContain('This is a note')
  })
})
