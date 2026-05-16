import { useState } from 'react'
import styles from './FrontmatterPanel.module.css'

interface Props {
  frontmatter: Record<string, unknown>
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split('T')[0]
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value)
}

export function FrontmatterPanel({ frontmatter }: Props) {
  const [expanded, setExpanded] = useState(true)
  const entries = Object.entries(frontmatter)

  if (entries.length === 0) return null

  return (
    <div className={styles.panel}>
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        aria-label="frontmatter toggle"
        aria-expanded={expanded}
      >
        <span>{expanded ? '▼' : '▶'}</span>
        <span>Frontmatter</span>
      </button>
      {expanded && (
        <div className={styles.body}>
          {entries.map(([key, value]) => (
            <div key={key} className={styles.row}>
              <span className={styles.key}>{key}</span>
              <span className={styles.value}>{formatValue(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
