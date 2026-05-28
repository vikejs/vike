export { getServerConfig }
export { isUniversalDeployVitePreview }

import { dirname, resolve } from 'node:path'
import type { ResolvedConfig } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { assert } from '../../../../utils/assert.js'
import '../../assertEnvVite.js'

function getServerConfig(vikeConfig: VikeConfigInternal) {
  let serverEntryId: string
  let serverFilePath: string | null = null
  let serverEntryVike: string
  let isServerEntry: boolean = false
  // universal-deploy support must be manually enabled
  const serverConfig: boolean =
    // +config.js > `export default { server: true }`
    vikeConfig.config.server ||
    // +server.js exists
    !!vikeConfig._pageConfigGlobal.configValueSources.server ||
    false
  if (serverConfig === false) return
  const serverPlusFile = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  if (serverPlusFile?.valueIsDefinedByPlusValueFile) {
    assert('filePathAbsoluteFilesystem' in serverPlusFile.definedAt)
    serverFilePath = serverPlusFile.definedAt.filePathAbsoluteFilesystem
    assert(serverFilePath)
    // +server.js > `export default { entry: './server/entrypoint.ts' }`
    const entry =
      serverPlusFile.valueIsLoaded && serverPlusFile.value && typeof serverPlusFile.value === 'object'
        ? (serverPlusFile.value as any).entry
        : undefined
    isServerEntry = typeof entry === 'string'
    assert(entry === undefined || isServerEntry)
    serverEntryVike = serverEntryId = isServerEntry ? resolve(dirname(entry)) : serverFilePath
  } else {
    serverEntryId = catchAllEntry
    serverEntryVike = 'vike/fetch'
  }

  return {
    // Used to filter which module ID to transform.
    // It points to a fully resolved server entry or the virtual universal-deploy catchAll entry.
    serverEntryId,
    // This entry will be pushed to universal-deploy via `addEntry`.
    // It either points to the default fetchable endpoint (vike/fetch), or one defined by the user through +server.
    serverEntryVike,
    serverFilePath,
    isServerEntry,
  }
}

function isUniversalDeployVitePreview(vikeConfig: VikeConfigInternal, viteConfigResolved: ResolvedConfig) {
  const isServerConfig = getServerConfig(vikeConfig)
  if (!isServerConfig) return null // not UD

  // @universal-deploy/node -> real preview
  // else -> vite preview
  const udNodePlugin = viteConfigResolved.plugins.find((p) => p.name.match(/^ud:node:(?!.*:disabled$)/))
  return !udNodePlugin
}
