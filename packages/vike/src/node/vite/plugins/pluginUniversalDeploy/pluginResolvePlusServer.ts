import type { Plugin } from 'vite'
import { pluginCommon } from './common.js'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

/**
 * If +server.js is defined, make virtual:ud:catch-all resolve to +server.js absolute path
 */
export function pluginServerEntryInject(serverFilePath: string): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:server',
    resolveId: {
      order: 'pre',
      filter: {
        id: new RegExp(escapeRegex(serverFilePath)),
      },
      handler() {
        // Will resolve the entry from the users project root
        return this.resolve(serverFilePath)
      },
    },
    ...pluginCommon,
  }
}
