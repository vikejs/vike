export { getServerConfig }
export { isUniversalDeployVitePreview }
export { getServerEntryFilePath_ifDev }

import type { ResolvedConfig } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { assert } from '../../../../utils/assert.js'
import '../../assertEnvVite.js'

function getServerConfig(vikeConfig: VikeConfigInternal) {
  let serverEntryId: string
  let serverFilePath: string | null = null
  let serverEntryVike: string
  const serverEntryFilePath = getServerEntryFilePath(vikeConfig)
  // universal-deploy support must be manually enabled
  const serverConfig: boolean =
    // +config.js > `export default { server: true }`
    vikeConfig.config.server ||
    // +server.js exists
    !!vikeConfig._pageConfigGlobal.configValueSources.server ||
    // +serverEntry.js exists
    !!serverEntryFilePath ||
    false
  if (serverConfig === false) return
  const serverPlusFile = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  if (serverPlusFile?.valueIsDefinedByPlusValueFile) {
    assert('filePathAbsoluteFilesystem' in serverPlusFile.definedAt)
    serverFilePath = serverPlusFile.definedAt.filePathAbsoluteFilesystem
    assert(serverFilePath)
    serverEntryId = serverFilePath
    serverEntryVike = serverFilePath
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
    // +serverEntry.js => it's the production server entry dist/server/index.mjs (instead of @universal-deploy/node's)
    serverEntryFilePath,
  }
}

// https://vike.dev/serverEntry
function getServerEntryFilePath(vikeConfig: VikeConfigInternal): string | null {
  const source = vikeConfig._pageConfigGlobal.configValueSources.serverEntry?.[0]
  if (!source) return null
  assert(source.valueIsLoaded && source.valueIsFilePath && typeof source.value === 'string')
  assert('filePathAbsoluteFilesystem' in source.definedAt)
  // `source.value` is the import path, e.g. `some-npm-package/serverEntry` if the file cannot be resolved
  return source.definedAt.filePathAbsoluteFilesystem ?? source.value
}

// The +serverEntry.js that `$ vike dev` runs: only if there isn't +server.js (otherwise +serverEntry.js is production-only)
// https://vike.dev/serverEntry
function getServerEntryFilePath_ifDev(vikeConfig: VikeConfigInternal): string | null {
  if (vikeConfig._pageConfigGlobal.configValueSources.server) return null
  return getServerEntryFilePath(vikeConfig)
}

function isUniversalDeployVitePreview(vikeConfig: VikeConfigInternal, viteConfigResolved: ResolvedConfig) {
  const isServerConfig = getServerConfig(vikeConfig)
  if (!isServerConfig) return null // not UD
  // +serverEntry.js => dist/server/index.mjs is the user's server entry => real preview
  if (isServerConfig.serverEntryFilePath) return false

  // @universal-deploy/node -> real preview
  // else -> vite preview
  const udNodePlugin = viteConfigResolved.plugins.find((p) => p.name.match(/^ud:node:(?!.*:disabled$)/))
  return !udNodePlugin
}
