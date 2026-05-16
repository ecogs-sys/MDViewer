import { readdir, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import type { FileNode } from '../shared/types'

export async function walkTree(folderPath: string): Promise<FileNode> {
  const entries = await readdir(folderPath, { withFileTypes: true })

  const sorted = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name)
  })

  const children: FileNode[] = []
  for (const entry of sorted) {
    const entryPath = join(folderPath, entry.name)
    if (entry.isDirectory()) {
      children.push(await walkTree(entryPath))
    } else if (extname(entry.name) === '.md') {
      children.push({ name: entry.name, path: entryPath, type: 'file' })
    }
  }

  return { name: basename(folderPath), path: folderPath, type: 'folder', children }
}

export async function readMarkdownFile(filePath: string): Promise<string> {
  return readFile(filePath, 'utf-8')
}
