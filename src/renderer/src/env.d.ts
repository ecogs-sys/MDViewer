/// <reference types="vite/client" />
import type { FileNode, Preferences } from '../../shared/types'

interface ElectronAPI {
  openFolder: () => Promise<string | null>
  readTree: (path: string) => Promise<FileNode>
  readFile: (path: string) => Promise<string>
  watchStart: (path: string) => Promise<void>
  onWatchEvent: (callback: () => void) => () => void
  onMenuOpenFolder: (callback: () => void) => () => void
  getPreferences: () => Promise<Preferences>
  setPreferences: (updates: Partial<Preferences>) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
