import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WelcomeScreen } from '../../../src/renderer/src/components/WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders an Open Folder button', () => {
    render(<WelcomeScreen onOpenFolder={vi.fn()} />)
    expect(screen.getByRole('button', { name: /open folder/i })).toBeInTheDocument()
  })

  it('calls onOpenFolder when button is clicked', () => {
    const onOpenFolder = vi.fn()
    render(<WelcomeScreen onOpenFolder={onOpenFolder} />)
    fireEvent.click(screen.getByRole('button', { name: /open folder/i }))
    expect(onOpenFolder).toHaveBeenCalledOnce()
  })
})
