import { useState, useEffect, useRef } from 'react'
import { basename } from 'path-browserify'
import type { FileNode } from '../../../shared/types'
import styles from './SearchOverlay.module.css'

function collectFiles(node: FileNode): FileNode[] {
  if (node.type === 'file') return [node]
  return node.children.flatMap(collectFiles)
}

function match(file: FileNode, query: string): boolean {
  const q = query.toLowerCase()
  return file.name.toLowerCase().includes(q) || file.path.toLowerCase().includes(q)
}

interface Props {
  tree: FileNode
  onSelect: (path: string) => void
  onClose: () => void
}

export function SearchOverlay({ tree, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const allFiles = collectFiles(tree)
  const results = query ? allFiles.filter(f => match(f, query)) : allFiles

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          role="searchbox"
          className={styles.input}
          placeholder="Search files…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className={styles.results}>
          {results.length === 0 && (
            <div className={styles.empty}>No files match "{query}"</div>
          )}
          {results.map(file => (
            <div
              key={file.path}
              className={styles.result}
              onClick={() => onSelect(file.path)}
            >
              <span className={styles.name}>{basename(file.path)}</span>
              <span className={styles.path}>{file.path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
