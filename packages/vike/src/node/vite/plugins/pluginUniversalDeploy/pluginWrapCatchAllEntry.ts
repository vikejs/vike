export { pluginWrapCatchAllEntry }

import type { Plugin } from 'vite'
import { wrapper } from 'vite-plugin-wrapper'
import { catchAllEntry } from '@universal-deploy/store'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

function pluginWrapCatchAllEntry(serverFilePath: string): Plugin {
  return wrapper({
    resolveId: {
      filter: {
        id: new RegExp(escapeRegex(catchAllEntry)),
      },
    },

    load(id) {
      return `
import mod from ${JSON.stringify(id)};
import serverMod from ${JSON.stringify(serverFilePath)};

const { fetch: _fetch, ...serverModRest } = serverMod;

export * from ${JSON.stringify(serverFilePath)};
export default { ...mod, ...serverModRest, fetch: mod.fetch };
`
    },
  })
}
