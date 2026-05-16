import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { mockElectronAPI } from '../setup'
import { useFileTree } from '../../../src/renderer/src/hooks/useFileTree'
import type { FileNode } from '../../../src/shared/types'

const mockTree: FileNode = {
  name: 'runs', path: '/runs', type: 'folder',
  children: [
    { name: 'README.md', path: '/runs/README.md', type: 'file' }
  ]
}

beforeEach(() => {
  vi.clearAllMocks()
  mockElectronAPI.readTree.mockResolvedValue(mockTree)
  mockElectronAPI.openFolder.mockResolvedValue('/runs')
})

describe('useFileTree', () => {
  it('loads tree when initialFolder is provided', async () => {
    const { result } = renderHook(() => useFileTree('/runs'))
    await act(async () => {})
    expect(result.current.tree).toEqual(mockTree)
  })

  it('tree is null when no initial folder', () => {
    const { result } = renderHook(() => useFileTree(null))
    expect(result.current.tree).toBeNull()
  })

  it('openFolder updates folderPath and loads tree', async () => {
    const { result } = renderHook(() => useFileTree(null))
    await act(async () => { await result.current.openFolder() })
    expect(result.current.folderPath).toBe('/runs')
    expect(result.current.tree).toEqual(mockTree)
  })
})
