import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { mockElectronAPI } from '../setup'
import { useFileContent } from '../../../src/renderer/src/hooks/useFileContent'

beforeEach(() => vi.clearAllMocks())

describe('useFileContent', () => {
  it('returns null when no filePath given', () => {
    const { result } = renderHook(() => useFileContent(null))
    expect(result.current.parsed).toBeNull()
  })

  it('loads and parses file when filePath is set', async () => {
    mockElectronAPI.readFile.mockResolvedValue('# Hello')
    const { result } = renderHook(() => useFileContent('/some/file.md'))
    await act(async () => {})
    expect(result.current.parsed?.html).toContain('<h1>Hello</h1>')
  })

  it('extracts frontmatter', async () => {
    mockElectronAPI.readFile.mockResolvedValue('---\ntitle: Doc\n---\n# Content')
    const { result } = renderHook(() => useFileContent('/file.md'))
    await act(async () => {})
    expect(result.current.parsed?.frontmatter.title).toBe('Doc')
  })
})
