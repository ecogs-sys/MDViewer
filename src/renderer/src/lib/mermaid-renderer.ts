import mermaid from 'mermaid'

let initialized = false
let lastDark = false

export async function renderMermaid(
  container: HTMLElement,
  isDark: boolean
): Promise<void> {
  if (!initialized || isDark !== lastDark) {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    })
    initialized = true
    lastDark = isDark
  }

  const blocks = container.querySelectorAll('code.language-mermaid')
  for (const block of blocks) {
    const parent = block.parentElement
    if (!parent) continue
    const definition = block.textContent ?? ''
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
    try {
      const { svg } = await mermaid.render(id, definition)
      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid-diagram'
      wrapper.innerHTML = svg
      parent.replaceWith(wrapper)
    } catch {
      // leave code block in place if Mermaid fails to parse
    }
  }
}
