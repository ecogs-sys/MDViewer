import { basename } from 'path-browserify'
import styles from './Toolbar.module.css'

type ThemeMode = 'dark' | 'light' | 'system'

const THEME_CYCLE: Record<ThemeMode, ThemeMode> = {
  system: 'dark',
  dark: 'light',
  light: 'system',
}

const THEME_ICONS: Record<ThemeMode, string> = {
  system: '💻',
  dark: '🌙',
  light: '☀️',
}

interface Props {
  folderPath: string | null
  onOpenFolder: () => void
  onSearch: () => void
  themeMode: ThemeMode
  onThemeChange: (mode: ThemeMode) => void
}

export function Toolbar({ folderPath, onOpenFolder, onSearch, themeMode, onThemeChange }: Props) {
  const folderName = folderPath ? basename(folderPath) : null

  return (
    <div className={styles.toolbar}>
      <button className={styles.openBtn} onClick={onOpenFolder}>
        📁 Open Folder
      </button>

      <span className={styles.path}>
        {folderName ?? <span className={styles.placeholder}>No folder open</span>}
      </span>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={onSearch}
          title="Search files (Ctrl+P)"
          aria-label="search"
        >
          🔍
        </button>
        <button
          className={styles.iconBtn}
          onClick={() => onThemeChange(THEME_CYCLE[themeMode])}
          title={`Theme: ${themeMode}`}
          aria-label="theme toggle"
        >
          {THEME_ICONS[themeMode]}
        </button>
      </div>
    </div>
  )
}
