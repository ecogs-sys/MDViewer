import type { Plugin } from 'unified'
import type { Root, Element, Text } from 'hast'
import { visit } from 'unist-util-visit'

type CalloutType = 'NOTE' | 'WARNING' | 'TIP' | 'IMPORTANT' | 'CAUTION'

const ICONS: Record<CalloutType, string> = {
  NOTE: 'ℹ NOTE',
  TIP: '💡 TIP',
  WARNING: '⚠ WARNING',
  IMPORTANT: '❗ IMPORTANT',
  CAUTION: '🔥 CAUTION',
}

export const calloutsPlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element, index, parent) => {
    if (node.tagName !== 'blockquote') return
    if (!parent || index === undefined) return

    const firstPara = node.children.find(
      (c): c is Element => c.type === 'element' && c.tagName === 'p'
    )
    if (!firstPara) return

    const firstText = firstPara.children.find((c): c is Text => c.type === 'text')
    if (!firstText) return

    const match = firstText.value.match(
      /^\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION)\]\s*/
    )
    if (!match) return

    const type = match[1] as CalloutType
    firstText.value = firstText.value.slice(match[0].length)

    const replacement: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['callout', `callout-${type.toLowerCase()}`] },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout-title'] },
          children: [{ type: 'text', value: ICONS[type] }],
        },
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout-body'] },
          children: node.children,
        },
      ],
    }

    parent.children.splice(index, 1, replacement)
  })
}
