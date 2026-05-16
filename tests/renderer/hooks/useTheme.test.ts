import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { mockElectronAPI } from '../setup'
import { useTheme } from '../../../src/renderer/src/hooks/useTheme'

beforeEach(() => {
  mockElectronAPI.getPreferences.mockResolvedValue({ lastFolderPath: null, theme: 'system' })
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme', () => {
  it('loads theme from preferences on mount', async () => {
    mockElectronAPI.getPreferences.mockResolvedValue({ lastFolderPath: null, theme: 'dark' })
    const { result } = renderHook(() => useTheme())
    await act(async () => {})
    expect(result.current.mode).toBe('dark')
  })

  it('sets data-theme on documentElement', async () => {
    mockElectronAPI.getPreferences.mockResolvedValue({ lastFolderPath: null, theme: 'dark' })
    renderHook(() => useTheme())
    await act(async () => {})
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists theme change via setPreferences', async () => {
    const { result } = renderHook(() => useTheme())
    await act(async () => {})
    act(() => result.current.setMode('light'))
    expect(mockElectronAPI.setPreferences).toHaveBeenCalledWith({ theme: 'light' })
  })
})
