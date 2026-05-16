import { app, BrowserWindow, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerIpcHandlers } from './ipc-handlers'
import { IPC } from '../shared/types'

const DEVTOOLS_FLAGS = ['--devtools', '--inspect-renderer']
const devtoolsRequested = process.argv.some((arg) => DEVTOOLS_FLAGS.includes(arg)) ||
  process.env['MDVIEWER_DEVTOOLS'] === '1'

function createWindow(): BrowserWindow {
  const appPath = app.getAppPath()
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'icon.png')
    : join(appPath, 'resources', 'icon.png')

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 700,
    minHeight: 500,
    show: false,
    icon: iconPath,
    webPreferences: {
      preload: join(appPath, 'dist-electron', 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.on('ready-to-show', () => {
    win.show()
    if (devtoolsRequested) win.webContents.openDevTools({ mode: 'detach' })
  })
  win.webContents.on('did-fail-load', (_, code, desc) => {
    console.error('[main] renderer failed to load:', code, desc)
    if (!win.isVisible()) win.show()
  })

  registerIpcHandlers(win)
  buildMenu(win)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(appPath, 'dist', 'index.html'))
  }

  return win
}

function buildMenu(win: BrowserWindow): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder...',
          accelerator: 'CmdOrCtrl+O',
          click: () => win.webContents.send(IPC.MENU_OPEN_FOLDER),
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mdviewer')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
