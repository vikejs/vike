export { getServerConfig }

import { assert } from '../../../../utils/assert.js'
import { catchAllEntry } from '@universal-deploy/store'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import '../../assertEnvVite.js'

function getServerConfig(vikeConfig: VikeConfigInternal) {
  let serverEntryId: string
  let serverFilePath: string | null = null
  let serverEntryVike: string
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
  }
}
