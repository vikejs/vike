export { preview }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { preview as previewVite, type ResolvedConfig, type PreviewServer } from 'vite'
import { importServerProductionIndex } from '@brillout/vite-plugin-server-entry/runtime'
import type { APIOptions } from './types.js'
import { getOutDirs } from '../plugin/shared/getOutDirs.js'
import { assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
import path from 'node:path'
import { onSetupPreview } from '../runtime/utils.js'

/**
 * Programmatically trigger `$ vike preview`
 *
 * https://vike.dev/api#preview
 */
async function preview(options: APIOptions = {}): Promise<{ viteServer?: PreviewServer; viteConfig: ResolvedConfig }> {
  onSetupPreview()
  const { viteConfigFromUserEnhanced, viteConfigResolved } = await prepareViteApiCall(options, 'preview')
  if (viteConfigResolved.vitePluginServerEntry?.inject) {
    const outDir = getOutDirs(viteConfigResolved).outDirRoot
    const { outServerIndex } = await importServerProductionIndex({ outDir })
    const outServerIndexRelative = path.relative(viteConfigResolved.root, outServerIndex)
    assertWarning(
      false,
      `Never run ${pc.cyan('$ vike preview')} in production, run ${pc.cyan(`$ node ${outServerIndexRelative}`)} instead (or Bun/Deno).`,
      { onlyOnce: true }
    )
    return {
      viteConfig: viteConfigResolved
    }
  } else {
    const server = await previewVite(viteConfigFromUserEnhanced)
    return {
      viteServer: server,
      viteConfig: server.config
    }
  }
}
