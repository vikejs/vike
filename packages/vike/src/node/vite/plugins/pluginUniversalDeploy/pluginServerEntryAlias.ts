export { pluginServerEntryAlias }

import type { Plugin } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import pc from '@brillout/picocolors'
import { pluginCommon } from './common.js'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import { assert, assertWarning } from '../../../../utils/assert.js'
import '../../assertEnvVite.js'

const serverAlias = 'vike:server'
// TO-DO/next-major-release: remove
const serverAliasDeprecated = 'vike:server-entry'
const virtualFileId = '\0' + serverAlias

// === Rolldown filter
const filterRolldownResolveId = {
  id: {
    include: [serverAlias, serverAliasDeprecated, virtualFileId].map((id) => new RegExp(`^${escapeRegex(id)}$`)),
  },
}
const filterRolldownLoad = {
  id: {
    include: [new RegExp(`^${escapeRegex(virtualFileId)}$`)],
  },
}
// ===

/** `vike:server` => alias for virtual:ud:catch-all, also re-exporting the non-default exports of +server.js (if any) */
function pluginServerEntryAlias(serverFilePath?: string | null): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:alias',
    resolveId: {
      filter: filterRolldownResolveId,
      handler(id) {
        if (id === serverAliasDeprecated) {
          assertWarning(
            false,
            `${pc.cyan(serverAliasDeprecated)} is deprecated in favor of ${pc.cyan(serverAlias)}, e.g. replace ${pc.cyan(`"main": "${serverAliasDeprecated}"`)} with ${pc.cyan(`"main": "${serverAlias}"`)} in your wrangler.jsonc`,
            { onlyOnce: true },
          )
        } else {
          assert(id === serverAlias || id === virtualFileId)
        }
        if (!serverFilePath) return catchAllEntry
        return virtualFileId
      },
    },
    load: {
      filter: filterRolldownLoad,
      handler(id) {
        assert(id === virtualFileId)
        assert(serverFilePath)
        // Also re-export non-default exports, e.g. to support Durable Objects
        return `import mod from ${JSON.stringify(catchAllEntry)};

export * from ${JSON.stringify(serverFilePath)};
export default mod;
`
      },
    },
    ...pluginCommon,
  }
}
