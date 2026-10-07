export { getServerConfig }
export { isUniversalDeployVitePreview }
export { isServerCustom }

import type { ResolvedConfig } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import type { PageConfigGlobalBuildTime } from '../../../../types/PageConfig.js'
import { assert } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import '../../assertEnvVite.js'

// +config.js > `export default { server: { custom: true } }` => +server.js is the server entry as-is (manual integration via renderPage(), no Universal Deploy)
function isServerCustom(pageConfigGlobal: Pick<PageConfigGlobalBuildTime, 'configValueSources'>): boolean {
  const sources = pageConfigGlobal.configValueSources.server ?? []
  // The value set by +config.js — +server.js itself sets the server entry
  const source = sources.find((source) => !source.valueIsDefinedByPlusValueFile)
  return !!source?.valueIsLoaded && isObject(source.value) && source.value.custom === true
}

function getServerConfig(vikeConfig: VikeConfigInternal) {
  let serverEntryId: string
  let serverFilePath: string | null = null
  let serverEntryVike: string
  // universal-deploy support must be manually enabled
  const serverConfig: boolean =
    // +config.js > `export default { server: true }`
    !!vikeConfig.config.server ||
    // +server.js exists
    !!vikeConfig._pageConfigGlobal.configValueSources.server ||
    false
  if (serverConfig === false) return
  const isCustom = isServerCustom(vikeConfig._pageConfigGlobal)
  const sources = vikeConfig._pageConfigGlobal.configValueSources.server ?? []
  const serverPlusFile = isCustom ? sources.find((source) => source.valueIsDefinedByPlusValueFile) : sources[0]
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
    isCustom,
  }
}

function isUniversalDeployVitePreview(vikeConfig: VikeConfigInternal, viteConfigResolved: ResolvedConfig) {
  const isServerConfig = getServerConfig(vikeConfig)
  if (!isServerConfig) return null // not UD
  // `server: { custom: true }` => dist/server/index.mjs is the user's +server.js => real preview
  if (isServerConfig.isCustom) return false

  // @universal-deploy/node -> real preview
  // else -> vite preview
  const udNodePlugin = viteConfigResolved.plugins.find((p) => p.name.match(/^ud:node:(?!.*:disabled$)/))
  return !udNodePlugin
}
