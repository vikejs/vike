export { materializeVirtualEntries }

import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { ResolvedConfig } from 'vite'
import { parseVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { isVirtualFileId } from '../../../../utils/virtualFileId.js'
import { generateVirtualFilePageEntry } from '../pluginVirtualFiles/generateVirtualFilePageEntry.js'
import { generateVirtualFileGlobalEntry } from '../pluginVirtualFiles/generateVirtualFileGlobalEntry.js'
import '../../assertEnvVite.js'

// Vite's deps optimizer relies on esbuild to scan `optimizeDeps.entries`, but esbuild can't
// crawl Vite virtual module IDs (`virtual:vike:page-entry:*`, `virtual:vike:global-entry:*`).
// Their transitive deps therefore surface lazily and cause "✨ new dependencies optimized"
// reload cycles.
//
// For each virtual entry, generate its content and write it to a real temp file so esbuild
// can scan the imports. Returns the entries list with virtual IDs replaced by their
// materialized file paths.
async function materializeVirtualEntries(entries: string[], config: ResolvedConfig): Promise<string[]> {
  const virtuals = entries.filter(isVirtualFileId)
  if (virtuals.length === 0) return entries

  const outDir = join(config.root, 'node_modules', '.vike', 'optimizeDeps-virtuals')
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const replaced = new Map<string, string>()
  for (const virtualId of virtuals) {
    const parsed = parseVirtualFileId(virtualId)
    if (!parsed) continue

    let code: string
    try {
      if (parsed.type === 'page-entry') {
        code = await generateVirtualFilePageEntry(virtualId, true)
      } else {
        code = await generateVirtualFileGlobalEntry(parsed.isForClientSide, true, virtualId, parsed.isClientRouting)
      }
    } catch {
      // The generator can throw (e.g. on transient HMR races). Skip silently — esbuild just
      // misses this entry's deps, same as before the materialization.
      continue
    }

    const safeName = virtualId.replace(/[^a-zA-Z0-9]/g, '_') + '.js'
    const filePath = join(outDir, safeName)
    await writeFile(filePath, code)
    replaced.set(virtualId, filePath)
  }

  return entries.map((e) => replaced.get(e) ?? e)
}
