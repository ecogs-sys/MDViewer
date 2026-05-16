import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FrontmatterPanel } from '../../../src/renderer/src/components/FrontmatterPanel'

describe('FrontmatterPanel', () => {
  it('renders nothing when frontmatter is empty', () => {
    const { container } = render(<FrontmatterPanel frontmatter={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders key-value pairs from frontmatter', () => {
    render(<FrontmatterPanel frontmatter={{ title: 'My Doc', status: 'draft' }} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('My Doc')).toBeInTheDocument()
    expect(screen.getByText('status')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('collapses and expands on header click', () => {
    render(<FrontmatterPanel frontmatter={{ title: 'Test' }} />)
    expect(screen.getByText('title')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: /frontmatter/i }))
    expect(screen.queryByText('title')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /frontmatter/i }))
    expect(screen.getByText('title')).toBeInTheDocument()
  })
})
