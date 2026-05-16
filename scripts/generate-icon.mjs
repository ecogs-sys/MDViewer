import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const resourcesDir = join(__dirname, '..', 'resources')
const svg = readFileSync(join(resourcesDir, 'icon.svg'))

// 1024x1024 PNG is enough — electron-builder generates platform-specific
// formats (.ico for Windows, .icns for macOS) from it during packaging.
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1024 } })
const pngBuffer = resvg.render().asPng()

const outPath = join(resourcesDir, 'icon.png')
writeFileSync(outPath, pngBuffer)
console.log(`Wrote ${outPath} (${pngBuffer.length} bytes, 1024x1024)`)
