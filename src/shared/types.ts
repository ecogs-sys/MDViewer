export type FileNode =
  | { name: string; path: string; type: 'file' }
  | { name: string; path: string; type: 'folder'; children: FileNode[] }

export interface Preferences {
  lastFolderPath: string | null
  theme: 'dark' | 'light' | 'system'
}

export const IPC = {
  OPEN_FOLDER:      'dialog:open-folder',
  READ_TREE:        'fs:read-tree',
  READ_FILE:        'fs:read-file',
  WATCH_START:      'fs:watch-start',
  WATCH_EVENT:      'fs:watch-event',
  PREFS_GET:        'prefs:get',
  PREFS_SET:        'prefs:set',
  MENU_OPEN_FOLDER: 'menu:open-folder',
} as const
