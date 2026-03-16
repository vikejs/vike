import { assert } from '../../../../utils/assert.js'
import { catchAllEntry } from '@universal-deploy/store'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import '../../assertEnvVite.js'

export function getServerInfo(vikeConfig: VikeConfigInternal) {
  let serverEntryId: string
  let serverFilePath: string | null = null
  const serverConfig = vikeConfig.config.server
  // universal-deploy support manually disabled by user
  if (serverConfig === false) return
  const serverPlusFile = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  if (serverPlusFile) {
    assert('filePathAbsoluteFilesystem' in serverPlusFile.definedAt)
    serverFilePath = serverPlusFile.definedAt.filePathAbsoluteFilesystem
    assert(serverFilePath)
    serverEntryId = serverFilePath
  } else {
    serverEntryId = catchAllEntry
  }
  if (serverConfig !== true && !serverFilePath) return
  const serverEntryVike = serverFilePath ?? 'vike/fetch'

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
