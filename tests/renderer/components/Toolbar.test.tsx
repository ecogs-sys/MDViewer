import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../../../src/renderer/src/components/Toolbar'

const defaultProps = {
  folderPath: null,
  onOpenFolder: vi.fn(),
  onSearch: vi.fn(),
  themeMode: 'system' as const,
  onThemeChange: vi.fn(),
}

describe('Toolbar', () => {
  it('renders Open Folder button', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /open folder/i })).toBeInTheDocument()
  })

  it('calls onOpenFolder when button is clicked', () => {
    const onOpenFolder = vi.fn()
    render(<Toolbar {...defaultProps} onOpenFolder={onOpenFolder} />)
    fireEvent.click(screen.getByRole('button', { name: /open folder/i }))
    expect(onOpenFolder).toHaveBeenCalledOnce()
  })

  it('displays the folder name when folderPath is set', () => {
    render(<Toolbar {...defaultProps} folderPath="/home/user/runs" />)
    expect(screen.getByText('runs')).toBeInTheDocument()
  })

  it('shows theme toggle button', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('cycles theme mode on toggle click: system → dark → light → system', () => {
    const onThemeChange = vi.fn()
    const { rerender } = render(
      <Toolbar {...defaultProps} themeMode="system" onThemeChange={onThemeChange} />
    )
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('dark')

    rerender(<Toolbar {...defaultProps} themeMode="dark" onThemeChange={onThemeChange} />)
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('light')

    rerender(<Toolbar {...defaultProps} themeMode="light" onThemeChange={onThemeChange} />)
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('system')
  })
})
