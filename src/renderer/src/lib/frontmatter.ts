export interface FrontmatterResult {
  frontmatter: Record<string, unknown>
  content: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export function extractFrontmatter(raw: string): FrontmatterResult {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { frontmatter: {}, content: raw }
  return { frontmatter: parseYamlBlock(match[1]), content: match[2] }
}

function parseYamlBlock(block: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = block.split(/\r?\n/)
  let currentKey: string | null = null
  let currentList: unknown[] | null = null

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    const listItem = line.match(/^\s+-\s+(.*)$/)
    if (listItem && currentKey && currentList) {
      currentList.push(parseScalar(listItem[1]))
      continue
    }

    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    const rawValue = kv[2]

    if (rawValue === '') {
      currentKey = key
      currentList = []
      result[key] = currentList
    } else {
      currentKey = null
      currentList = null
      result[key] = parseScalar(rawValue)
    }
  }

  for (const key of Object.keys(result)) {
    const v = result[key]
    if (Array.isArray(v) && v.length === 0) result[key] = ''
  }

  return result
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number(trimmed)
  const quoted = trimmed.match(/^(['"])(.*)\1$/)
  if (quoted) return quoted[2]
  return trimmed
}
