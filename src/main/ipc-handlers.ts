import { ipcMain, dialog, BrowserWindow } from 'electron'
import { watch, FSWatcher } from 'fs'
import { IPC } from '../shared/types'
import type { Preferences } from '../shared/types'
import { walkTree, readMarkdownFile } from './file-service'
import { getPreferences, setPreferences } from './preferences'

let watcher: FSWatcher | null = null

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle(IPC.OPEN_FOLDER, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Open Folder',
    })
    if (result.canceled || result.filePaths.length === 0) return null
    const folderPath = result.filePaths[0]
    setPreferences({ lastFolderPath: folderPath })
    return folderPath
  })

  ipcMain.handle(IPC.READ_TREE, (_event, folderPath: string) => walkTree(folderPath))

  ipcMain.handle(IPC.READ_FILE, (_event, filePath: string) => readMarkdownFile(filePath))

  ipcMain.handle(IPC.WATCH_START, (_event, folderPath: string) => {
    watcher?.close()
    watcher = watch(folderPath, { recursive: true }, () => {
      mainWindow.webContents.send(IPC.WATCH_EVENT)
    })
  })

  ipcMain.handle(IPC.PREFS_GET, () => getPreferences())

  ipcMain.handle(IPC.PREFS_SET, (_event, updates: Partial<Preferences>) => {
    setPreferences(updates)
  })
}
