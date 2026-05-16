/// <reference types="vite-plugin-electron/electron-env" />

// Used in Renderer process, exposed in `preload/index.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
