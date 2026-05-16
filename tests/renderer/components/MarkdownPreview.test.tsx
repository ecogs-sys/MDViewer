import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { mockElectronAPI } from '../setup'
import { act } from '@testing-library/react'

vi.mock('../../../src/renderer/src/lib/mermaid-renderer', () => ({
  renderMermaid: vi.fn().mockResolvedValue(undefined),
}))

import { MarkdownPreview } from '../../../src/renderer/src/components/MarkdownPreview'

beforeEach(() => vi.clearAllMocks())

describe('MarkdownPreview', () => {
  it('shows nothing when no file is selected', () => {
    const { container } = render(
      <MarkdownPreview filePath={null} folderPath={null} isDark={false} />
    )
    expect(container.querySelector('.markdown-body')).toBeNull()
  })

  it('renders markdown HTML after loading', async () => {
    mockElectronAPI.readFile.mockResolvedValue('# My Doc')
    render(<MarkdownPreview filePath="/doc.md" folderPath="/folder" isDark={false} />)
    await act(async () => {})
    const h1 = document.querySelector('h1')
    expect(h1?.textContent).toBe('My Doc')
  })

  it('renders frontmatter panel when frontmatter is present', async () => {
    mockElectronAPI.readFile.mockResolvedValue('---\ntitle: Test\n---\n# Hello')
    render(<MarkdownPreview filePath="/doc.md" folderPath="/folder" isDark={false} />)
    await act(async () => {})
    expect(screen.getByText('title')).toBeInTheDocument()
  })
})
