import { useState } from 'react'
import type { FileNode } from '../../../shared/types'
import styles from './FileTree.module.css'

interface Props {
  tree: FileNode
  selectedPath: string | null
  onSelect: (path: string) => void
}

interface NodeProps {
  node: FileNode
  selectedPath: string | null
  onSelect: (path: string) => void
  depth: number
}

function TreeNode({ node, selectedPath, onSelect, depth }: NodeProps) {
  const [expanded, setExpanded] = useState(true)
  const isSelected = node.path === selectedPath
  const indent = depth * 14

  if (node.type === 'file') {
    return (
      <div
        className={`${styles.item} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => onSelect(node.path)}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(node.path)}
      >
        <span className={styles.fileIcon}>📄</span>
        <span className={styles.name}>{node.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className={styles.folder}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => setExpanded(!expanded)}
        role="treeitem"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <span className={styles.arrow}>{expanded ? '▼' : '▶'}</span>
        <span className={styles.folderIcon}>📁</span>
        <span className={styles.name}>{node.name}</span>
      </div>
      {expanded && node.children.map((child) => (
        <TreeNode
          key={child.path}
          node={child}
          selectedPath={selectedPath}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export function FileTree({ tree, selectedPath, onSelect }: Props) {
  return (
    <div className={styles.tree} role="tree" aria-label="File explorer">
      <div className={styles.header}>Explorer</div>
      <TreeNode
        node={tree}
        selectedPath={selectedPath}
        onSelect={onSelect}
        depth={0}
      />
    </div>
  )
}
