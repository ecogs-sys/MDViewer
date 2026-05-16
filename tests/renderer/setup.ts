import { vi } from 'vitest'
import '@testing-library/jest-dom'

const mockElectronAPI = {
  openFolder: vi.fn(),
  readTree: vi.fn(),
  readFile: vi.fn(),
  watchStart: vi.fn().mockResolvedValue(undefined),
  onWatchEvent: vi.fn().mockReturnValue(() => {}),
  onMenuOpenFolder: vi.fn().mockReturnValue(() => {}),
  getPreferences: vi.fn().mockResolvedValue({ lastFolderPath: null, theme: 'system' }),
  setPreferences: vi.fn().mockResolvedValue(undefined),
}

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
})

export { mockElectronAPI }
