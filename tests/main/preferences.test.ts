import { vi } from 'vitest'

// electron-store needs Electron's app.getPath() — mock it for unit tests
vi.mock('electron-store', () => {
  return {
    default: class MockStore {
      private data: Record<string, unknown> = {}
      constructor(opts: { defaults?: Record<string, unknown> }) {
        this.data = { ...(opts.defaults ?? {}) }
      }
      get(key: string) { return this.data[key] }
      set(key: string, value: unknown) { this.data[key] = value }
    }
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { getPreferences, setPreferences } from '../../src/main/preferences'

beforeEach(() => {
  setPreferences({ lastFolderPath: null, theme: 'system' })
})

describe('getPreferences', () => {
  it('returns defaults on first call', () => {
    const prefs = getPreferences()
    expect(prefs.lastFolderPath).toBeNull()
    expect(prefs.theme).toBe('system')
  })
})

describe('setPreferences', () => {
  it('persists lastFolderPath', () => {
    setPreferences({ lastFolderPath: '/some/path' })
    expect(getPreferences().lastFolderPath).toBe('/some/path')
  })

  it('persists theme', () => {
    setPreferences({ theme: 'dark' })
    expect(getPreferences().theme).toBe('dark')
  })

  it('updates only specified keys', () => {
    setPreferences({ theme: 'light' })
    setPreferences({ lastFolderPath: '/path' })
    const prefs = getPreferences()
    expect(prefs.theme).toBe('light')
    expect(prefs.lastFolderPath).toBe('/path')
  })
})
