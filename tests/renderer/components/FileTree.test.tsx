import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileTree } from '../../../src/renderer/src/components/FileTree'
import type { FileNode } from '../../../src/shared/types'

const tree: FileNode = {
  name: 'runs', path: '/runs', type: 'folder',
  children: [
    {
      name: 'docs', path: '/runs/docs', type: 'folder',
      children: [{ name: 'guide.md', path: '/runs/docs/guide.md', type: 'file' }]
    },
    { name: 'README.md', path: '/runs/README.md', type: 'file' }
  ]
}

describe('FileTree', () => {
  it('renders top-level folder name', () => {
    render(<FileTree tree={tree} selectedPath={null} onSelect={vi.fn()} />)
    expect(screen.getByText('runs')).toBeInTheDocument()
  })

  it('renders files at root level', () => {
    render(<FileTree tree={tree} selectedPath={null} onSelect={vi.fn()} />)
    expect(screen.getByText('README.md')).toBeInTheDocument()
  })

  it('calls onSelect with file path when file is clicked', () => {
    const onSelect = vi.fn()
    render(<FileTree tree={tree} selectedPath={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('README.md'))
    expect(onSelect).toHaveBeenCalledWith('/runs/README.md')
  })

  it('highlights the selected file', () => {
    const { container } = render(
      <FileTree tree={tree} selectedPath="/runs/README.md" onSelect={vi.fn()} />
    )
    const selected = container.querySelector('[aria-selected="true"]')
    expect(selected).toBeInTheDocument()
    expect(selected?.textContent).toContain('README.md')
  })

  it('collapses a folder when its name is clicked', () => {
    render(<FileTree tree={tree} selectedPath={null} onSelect={vi.fn()} />)
    expect(screen.getByText('guide.md')).toBeInTheDocument()
    fireEvent.click(screen.getByText('docs'))
    expect(screen.queryByText('guide.md')).not.toBeInTheDocument()
  })
})
