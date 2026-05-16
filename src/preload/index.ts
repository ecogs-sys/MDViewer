import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/types'
import type { FileNode, Preferences } from '../shared/types'

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC.OPEN_FOLDER),

  readTree: (path: string): Promise<FileNode> =>
    ipcRenderer.invoke(IPC.READ_TREE, path),

  readFile: (path: string): Promise<string> =>
    ipcRenderer.invoke(IPC.READ_FILE, path),

  watchStart: (path: string): Promise<void> =>
    ipcRenderer.invoke(IPC.WATCH_START, path),

  onWatchEvent: (callback: () => void): (() => void) => {
    const listener = () => callback()
    ipcRenderer.on(IPC.WATCH_EVENT, listener)
    return () => ipcRenderer.removeListener(IPC.WATCH_EVENT, listener)
  },

  onMenuOpenFolder: (callback: () => void): (() => void) => {
    const listener = () => callback()
    ipcRenderer.on(IPC.MENU_OPEN_FOLDER, listener)
    return () => ipcRenderer.removeListener(IPC.MENU_OPEN_FOLDER, listener)
  },

  getPreferences: (): Promise<Preferences> =>
    ipcRenderer.invoke(IPC.PREFS_GET),

  setPreferences: (updates: Partial<Preferences>): Promise<void> =>
    ipcRenderer.invoke(IPC.PREFS_SET, updates),
})
