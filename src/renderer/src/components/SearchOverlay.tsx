import type { FileNode } from '../../../shared/types'

interface Props {
  tree: FileNode
  onSelect: (path: string) => void
  onClose: () => void
}

export function SearchOverlay({ onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)' }}
    />
  )
}
