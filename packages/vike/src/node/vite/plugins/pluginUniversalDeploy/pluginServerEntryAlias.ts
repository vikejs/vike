export { pluginServerEntryAlias }

import type { Plugin } from 'vite'
import { pluginCommon } from './common.js'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import { catchAllEntry } from '@universal-deploy/store'
import '../../assertEnvVite.js'

function pluginServerEntryAlias(): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:alias',
    resolveId: {
      filter: {
        // User facing alias for virtual:ud:catch-all
        id: new RegExp(escapeRegex('vike:server-entry')),
      },
      handler() {
        return this.resolve(catchAllEntry)
      },
    },
    ...pluginCommon,
  }
}
