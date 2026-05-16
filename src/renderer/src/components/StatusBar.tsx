import { basename } from 'path-browserify'
import type { FileNode } from '../../../shared/types'
import styles from './StatusBar.module.css'

function countFiles(node: FileNode): number {
  if (node.type === 'file') return 1
  return node.children.reduce((sum, child) => sum + countFiles(child), 0)
}

interface Props {
  filePath: string | null
  tree: FileNode | null
}

export function StatusBar({ filePath, tree }: Props) {
  const fileCount = tree ? countFiles(tree) : 0

  return (
    <div className={styles.bar}>
      <span>{filePath ? basename(filePath) : ''}</span>
      <span>{tree ? `${tree.name} · ${fileCount} file${fileCount !== 1 ? 's' : ''}` : ''}</span>
    </div>
  )
}
