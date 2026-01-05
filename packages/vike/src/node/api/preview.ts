import './assertEnvApi.js'

export { preview }
export type { CliPreviewConfig }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { preview as previewVite, type ResolvedConfig, type PreviewServer } from 'vite'
import { importServerProductionIndex } from '@brillout/vite-plugin-server-entry/runtime'
import type { ApiOptions } from './types.js'
import { getOutDirs } from '../vite/shared/getOutDirs.js'
import { assertUsage, assertWarning } from '../../utils/assert.js'
import { onSetupPreview } from '../../utils/assertSetup.js'
import { isCallable } from '../../utils/isCallable.js'
import pc from '@brillout/picocolors'
import path from 'node:path'
import { getVikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'

/**
 * Programmatically trigger `$ vike preview`
 *
 * https://vike.dev/api#preview
 */
async function preview(options: ApiOptions = {}): Promise<{ viteServer?: PreviewServer; viteConfig: ResolvedConfig }> {
  onSetupPreview()
  const { viteConfigFromUserResolved, viteConfigResolved } = await prepareViteApiCall(options, 'preview')

  const cliPreview = await resolveCliPreviewConfig()
  assertUsage(cliPreview !== false, `${pc.cyan('$ vike preview')} isn't supported`)
  const useVite =
    cliPreview === 'vite' || (cliPreview === undefined && !viteConfigResolved.vitePluginServerEntry?.inject)
  if (!useVite) {
    // Dynamically import() server production entry dist/server/index.js
    const outDir = getOutDirs(viteConfigResolved, undefined).outDirRoot
    const { outServerIndex } = await importServerProductionIndex({ outDir })
    const outServerIndexRelative = path.relative(viteConfigResolved.root, outServerIndex)
    assertWarning(
      false,
      `Never run ${pc.cyan('$ vike preview')} in production, run ${pc.cyan(`$ node ${outServerIndexRelative}`)} instead (or Bun/Deno).`,
      { onlyOnce: true },
    )
    return {
      viteConfig: viteConfigResolved,
    }
  } else {
    // Use Vite's preview server
    const server = await previewVite(viteConfigFromUserResolved)
    return {
      viteServer: server,
      viteConfig: server.config,
    }
  }
}

async function resolveCliPreviewConfig(): Promise<CliPreviewValue> {
  const vikeConfig = await getVikeConfigInternal()
  const val = vikeConfig.config.cli?.preview
  if (!isCallable(val)) {
    return val
  } else {
    return await val()
  }
}
type CliPreviewValue = boolean | 'vite' | undefined
type CliPreviewConfig = CliPreviewValue | (() => CliPreviewValue | Promise<CliPreviewValue>)
