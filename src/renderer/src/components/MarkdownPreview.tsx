import { useRef, useEffect } from 'react'
import { useFileContent } from '../hooks/useFileContent'
import { FrontmatterPanel } from './FrontmatterPanel'
import { renderMermaid } from '../lib/mermaid-renderer'
import styles from './MarkdownPreview.module.css'
import '../styles/markdown.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

interface Props {
  filePath: string | null
  folderPath: string | null
  isDark: boolean
}

export function MarkdownPreview({ filePath, folderPath: _folderPath, isDark }: Props) {
  const { parsed, loading } = useFileContent(filePath)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || !parsed) return
    renderMermaid(contentRef.current, isDark)
  }, [parsed, isDark])

  if (!filePath) return <div className={styles.empty} />

  if (loading) {
    return <div className={styles.loading}>Loading…</div>
  }

  return (
    <div className={styles.container}>
      {parsed && <FrontmatterPanel frontmatter={parsed.frontmatter} />}
      <div className={styles.scroll}>
        <div
          ref={contentRef}
          className={`markdown-body ${styles.content}`}
          dangerouslySetInnerHTML={{ __html: parsed?.html ?? '' }}
        />
      </div>
    </div>
  )
}
