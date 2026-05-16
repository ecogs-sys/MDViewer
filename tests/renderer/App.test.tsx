import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { mockElectronAPI } from './setup'
import type { FileNode } from '../../src/shared/types'

vi.mock('../../src/renderer/src/lib/mermaid-renderer', () => ({
  renderMermaid: vi.fn().mockResolvedValue(undefined),
}))

import App from '../../src/renderer/src/App'

const tree: FileNode = {
  name: 'runs', path: '/runs', type: 'folder',
  children: [{ name: 'README.md', path: '/runs/README.md', type: 'file' }]
}

beforeEach(() => {
  vi.clearAllMocks()
  mockElectronAPI.getPreferences.mockResolvedValue({ lastFolderPath: null, theme: 'system' })
  mockElectronAPI.readTree.mockResolvedValue(tree)
  mockElectronAPI.readFile.mockResolvedValue('# Hello')
})

describe('App', () => {
  it('shows WelcomeScreen when no folder is saved', async () => {
    render(<App />)
    await act(async () => {})
    expect(screen.getByRole('button', { name: /open folder/i })).toBeInTheDocument()
  })

  it('loads tree automatically when lastFolderPath is saved', async () => {
    mockElectronAPI.getPreferences.mockResolvedValue({
      lastFolderPath: '/runs',
      theme: 'system',
    })
    render(<App />)
    await act(async () => {})
    expect(screen.getByText('README.md')).toBeInTheDocument()
  })

  it('renders preview when a file is selected', async () => {
    mockElectronAPI.getPreferences.mockResolvedValue({
      lastFolderPath: '/runs',
      theme: 'system',
    })
    render(<App />)
    await act(async () => {})
    fireEvent.click(screen.getByText('README.md'))
    await act(async () => {})
    const h1 = document.querySelector('h1')
    expect(h1?.textContent).toBe('Hello')
  })
})
