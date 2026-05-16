import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import type { Preferences } from '../../shared/types'
import './styles/global.css'
import styles from './App.module.css'

export default function App() {
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const { resolved } = useTheme()

  useEffect(() => {
    window.electronAPI.getPreferences().then((prefs: Preferences) => {
      if (prefs.lastFolderPath) setFolderPath(prefs.lastFolderPath)
    })
  }, [])

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <p style={{ padding: '2rem', color: 'var(--text)' }}>
          Shell OK — theme: {resolved}, folder: {folderPath ?? 'none'}
        </p>
      </div>
    </div>
  )
}
