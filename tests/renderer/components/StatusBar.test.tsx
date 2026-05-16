import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBar } from '../../../src/renderer/src/components/StatusBar'
import type { FileNode } from '../../../src/shared/types'

const tree: FileNode = {
  name: 'runs', path: '/runs', type: 'folder',
  children: [
    { name: 'a.md', path: '/runs/a.md', type: 'file' },
    {
      name: 'sub', path: '/runs/sub', type: 'folder',
      children: [{ name: 'b.md', path: '/runs/sub/b.md', type: 'file' }]
    }
  ]
}

describe('StatusBar', () => {
  it('shows file count when tree is provided', () => {
    render(<StatusBar filePath={null} tree={tree} />)
    expect(screen.getByText(/2 files/)).toBeInTheDocument()
  })

  it('shows current file name', () => {
    render(<StatusBar filePath="/runs/a.md" tree={tree} />)
    expect(screen.getByText('a.md')).toBeInTheDocument()
  })

  it('shows nothing for filePath when null', () => {
    render(<StatusBar filePath={null} tree={tree} />)
    expect(screen.queryByText('.md')).not.toBeInTheDocument()
  })
})
