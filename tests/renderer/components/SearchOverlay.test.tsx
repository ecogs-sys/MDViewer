import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchOverlay } from '../../../src/renderer/src/components/SearchOverlay'
import type { FileNode } from '../../../src/shared/types'

const tree: FileNode = {
  name: 'runs', path: '/runs', type: 'folder',
  children: [
    { name: 'req-spec.md', path: '/runs/req-spec.md', type: 'file' },
    { name: 'tech-spec.md', path: '/runs/tech-spec.md', type: 'file' },
    {
      name: 'docs', path: '/runs/docs', type: 'folder',
      children: [{ name: 'README.md', path: '/runs/docs/README.md', type: 'file' }]
    }
  ]
}

describe('SearchOverlay', () => {
  it('renders a search input', () => {
    render(<SearchOverlay tree={tree} onSelect={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('shows all files initially', () => {
    render(<SearchOverlay tree={tree} onSelect={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('req-spec.md')).toBeInTheDocument()
    expect(screen.getByText('tech-spec.md')).toBeInTheDocument()
    expect(screen.getByText('README.md')).toBeInTheDocument()
  })

  it('filters files as user types', () => {
    render(<SearchOverlay tree={tree} onSelect={vi.fn()} onClose={vi.fn()} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'spec' } })
    expect(screen.getByText('req-spec.md')).toBeInTheDocument()
    expect(screen.getByText('tech-spec.md')).toBeInTheDocument()
    expect(screen.queryByText('README.md')).not.toBeInTheDocument()
  })

  it('calls onSelect with file path when result is clicked', () => {
    const onSelect = vi.fn()
    render(<SearchOverlay tree={tree} onSelect={onSelect} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('req-spec.md'))
    expect(onSelect).toHaveBeenCalledWith('/runs/req-spec.md')
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<SearchOverlay tree={tree} onSelect={vi.fn()} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
