import { vi } from 'vitest'
import '@testing-library/jest-dom'

// jsdom does not implement window.matchMedia; provide a minimal stub
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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
