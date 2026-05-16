import { useState, useEffect } from 'react'
import { parseMarkdown, type ParsedMarkdown } from '../lib/markdown-pipeline'

export function useFileContent(filePath: string | null) {
  const [parsed, setParsed] = useState<ParsedMarkdown | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!filePath) { setParsed(null); return }
    let cancelled = false
    setLoading(true)
    ;(async () => {
      const raw = await window.electronAPI.readFile(filePath)
      if (cancelled) return
      const result = await parseMarkdown(raw)
      if (cancelled) return
      setParsed(result)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [filePath])

  return { parsed, loading }
}
