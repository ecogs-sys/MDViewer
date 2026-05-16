import { useState, useEffect, useCallback } from 'react'
import { useTheme } from './hooks/useTheme'
import { useFileTree } from './hooks/useFileTree'
import { Toolbar } from './components/Toolbar'
import { FileTree } from './components/FileTree'
import { MarkdownPreview } from './components/MarkdownPreview'
import { WelcomeScreen } from './components/WelcomeScreen'
import { StatusBar } from './components/StatusBar'
import { SearchOverlay } from './components/SearchOverlay'
import type { Preferences } from '../../shared/types'
import './styles/global.css'
import styles from './App.module.css'

export default function App() {
  const [initialFolder, setInitialFolder] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [prefsLoaded, setPrefsLoaded] = useState(false)

  const { mode, setMode, resolved } = useTheme()
  const { tree, folderPath, openFolder } = useFileTree(initialFolder)

  useEffect(() => {
    window.electronAPI.getPreferences().then((prefs: Preferences) => {
      if (prefs.lastFolderPath) setInitialFolder(prefs.lastFolderPath)
      setPrefsLoaded(true)
    })
  }, [])

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuOpenFolder(() => openFolder())
    return cleanup
  }, [openFolder])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        if (tree) setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tree])

  const handleSearchSelect = useCallback((path: string) => {
    setSelectedFile(path)
    setSearchOpen(false)
  }, [])

  if (!prefsLoaded) return null

  return (
    <div className={styles.app}>
      {tree && (
        <Toolbar
          folderPath={folderPath}
          onOpenFolder={openFolder}
          onSearch={() => setSearchOpen(true)}
          themeMode={mode}
          onThemeChange={setMode}
        />
      )}
      <div className={styles.main}>
        {tree ? (
          <>
            <FileTree
              tree={tree}
              selectedPath={selectedFile}
              onSelect={setSelectedFile}
            />
            <MarkdownPreview
              filePath={selectedFile}
              folderPath={folderPath}
              isDark={resolved === 'dark'}
            />
          </>
        ) : (
          <WelcomeScreen onOpenFolder={openFolder} />
        )}
      </div>
      <StatusBar filePath={selectedFile} tree={tree} />
      {searchOpen && tree && (
        <SearchOverlay
          tree={tree}
          onSelect={handleSearchSelect}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}
