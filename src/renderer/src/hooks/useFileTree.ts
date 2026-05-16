import { useState, useEffect, useCallback } from 'react'
import type { FileNode } from '../../../shared/types'

export function useFileTree(initialFolder: string | null) {
  const [folderPath, setFolderPath] = useState<string | null>(initialFolder)
  const [tree, setTree] = useState<FileNode | null>(null)

  const loadTree = useCallback(async (path: string) => {
    const node = await window.electronAPI.readTree(path)
    setTree(node)
    await window.electronAPI.watchStart(path)
  }, [])

  useEffect(() => {
    if (!folderPath) return
    loadTree(folderPath)
  }, [folderPath, loadTree])

  useEffect(() => {
    if (!folderPath) return
    const cleanup = window.electronAPI.onWatchEvent(() => loadTree(folderPath))
    return cleanup
  }, [folderPath, loadTree])

  const openFolder = useCallback(async () => {
    const path = await window.electronAPI.openFolder()
    if (path) setFolderPath(path)
  }, [])

  return { tree, folderPath, openFolder }
}
