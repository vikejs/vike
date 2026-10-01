export { pluginWrapServerEntry }

import type { Plugin } from 'vite'
import { wrapper } from 'vite-plugin-wrapper'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

function pluginWrapServerEntry(serverEntryVike: string): Plugin {
  return wrapper({
    resolveId: {
      filter: {
        id: new RegExp(`^${escapeRegex(serverEntryVike)}$`),
      },
    },

    // Unwrap all prod.* options, and apply +middleware before the server's handler
    load(id) {
      return `
import mod from ${JSON.stringify(id)};
import { withMiddlewares } from 'vike/__internal';

export * from ${JSON.stringify(id)};
export default withMiddlewares({ ...mod, ...mod?.prod });
`
    },
  })
}
