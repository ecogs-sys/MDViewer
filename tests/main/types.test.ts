import { describe, it, expect } from 'vitest'
import { IPC } from '../../src/shared/types'

describe('IPC constants', () => {
  it('has all required channel names', () => {
    expect(IPC.OPEN_FOLDER).toBe('dialog:open-folder')
    expect(IPC.READ_TREE).toBe('fs:read-tree')
    expect(IPC.READ_FILE).toBe('fs:read-file')
    expect(IPC.WATCH_START).toBe('fs:watch-start')
    expect(IPC.WATCH_EVENT).toBe('fs:watch-event')
    expect(IPC.PREFS_GET).toBe('prefs:get')
    expect(IPC.PREFS_SET).toBe('prefs:set')
    expect(IPC.MENU_OPEN_FOLDER).toBe('menu:open-folder')

    expect(Object.keys(IPC).sort()).toEqual([
      'MENU_OPEN_FOLDER', 'OPEN_FOLDER', 'PREFS_GET', 'PREFS_SET',
      'READ_FILE', 'READ_TREE', 'WATCH_EVENT', 'WATCH_START',
    ])

    const values = Object.values(IPC)
    expect(new Set(values).size).toBe(values.length)
  })
})
