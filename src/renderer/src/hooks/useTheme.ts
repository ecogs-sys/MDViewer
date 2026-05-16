import { useState, useEffect } from 'react'
import type { Preferences } from '../../../../shared/types'

type ThemeMode = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>('system')
  const resolved: ResolvedTheme = mode === 'system' ? getSystemTheme() : mode

  useEffect(() => {
    window.electronAPI.getPreferences().then((prefs: Preferences) => {
      setModeState(prefs.theme)
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved)
  }, [resolved])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () =>
      document.documentElement.setAttribute('data-theme', getSystemTheme())
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    window.electronAPI.setPreferences({ theme: newMode })
  }

  return { mode, setMode, resolved }
}
