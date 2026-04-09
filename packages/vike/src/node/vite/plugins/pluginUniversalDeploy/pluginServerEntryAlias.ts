export { pluginServerEntryAlias }

import type { Plugin } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import { pluginCommon } from './common.js'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import { assert } from '../../../../utils/assert.js'
import '../../assertEnvVite.js'

const serverEntryAlias = 'vike:server-entry'
const virtualFileId = '\0' + serverEntryAlias

// === Rolldown filter
const filterRolldown = {
  id: {
    include: [new RegExp(escapeRegex(serverEntryAlias)), new RegExp(escapeRegex(virtualFileId))],
  },
}
// ===

function pluginServerEntryAlias(serverFilePath?: string | null): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:alias',
    resolveId: {
      filter: filterRolldown,
      handler() {
        // Alias for virtual:ud:catch if no userland server entry
        if (!serverFilePath) return catchAllEntry
        return virtualFileId
      },
    },
    load: {
      filter: filterRolldown,
      handler() {
        assert(serverFilePath)
        // Also re-export non-default exports, to support Durable Objects
        return `import mod from ${JSON.stringify(catchAllEntry)};

export * from ${JSON.stringify(serverFilePath)};
export default mod;
`
      },
    },
    ...pluginCommon,
  }
}
