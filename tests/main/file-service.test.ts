import { describe, it, expect, beforeAll } from 'vitest'
import { mkdtemp, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { walkTree, readMarkdownFile } from '../../src/main/file-service'

let tmpDir: string

beforeAll(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), 'mdviewer-test-'))
  await writeFile(join(tmpDir, 'README.md'), '# Hello')
  await mkdir(join(tmpDir, 'docs'))
  await writeFile(join(tmpDir, 'docs', 'guide.md'), '# Guide')
  await writeFile(join(tmpDir, 'docs', 'image.png'), '') // non-md, should be ignored
})

describe('walkTree', () => {
  it('returns a folder node with the folder name', async () => {
    const tree = await walkTree(tmpDir)
    expect(tree.type).toBe('folder')
    expect(tree.path).toBe(tmpDir)
  })

  it('includes .md files at the root', async () => {
    const tree = await walkTree(tmpDir)
    const files = tree.children!.filter(c => c.type === 'file')
    expect(files.some(f => f.name === 'README.md')).toBe(true)
  })

  it('ignores non-.md files', async () => {
    const tree = await walkTree(tmpDir)
    const docsFolder = tree.children!.find(c => c.name === 'docs')!
    const fileNames = docsFolder.children!.map(c => c.name)
    expect(fileNames).not.toContain('image.png')
  })

  it('recurses into subfolders', async () => {
    const tree = await walkTree(tmpDir)
    const docsFolder = tree.children!.find(c => c.name === 'docs')
    expect(docsFolder).toBeDefined()
    expect(docsFolder!.type).toBe('folder')
    expect(docsFolder!.children!.some(c => c.name === 'guide.md')).toBe(true)
  })

  it('lists folders before files', async () => {
    const tree = await walkTree(tmpDir)
    const firstChild = tree.children![0]
    expect(firstChild.type).toBe('folder')
  })
})

describe('readMarkdownFile', () => {
  it('returns the file content as a string', async () => {
    const content = await readMarkdownFile(join(tmpDir, 'README.md'))
    expect(content).toBe('# Hello')
  })
})
