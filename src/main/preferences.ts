import Store from 'electron-store'
import type { Preferences } from '../shared/types'

const store = new Store<Preferences>({
  name: 'preferences',
  defaults: {
    lastFolderPath: null,
    theme: 'system',
  },
})

export function getPreferences(): Preferences {
  return {
    lastFolderPath: store.get('lastFolderPath'),
    theme: store.get('theme'),
  }
}

export function setPreferences(updates: Partial<Preferences>): void {
  if (updates.lastFolderPath !== undefined) store.set('lastFolderPath', updates.lastFolderPath)
  if (updates.theme !== undefined) store.set('theme', updates.theme)
}
