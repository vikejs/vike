export { pluginUnwrapProdOptions }

import type { Plugin } from 'vite'
import { wrapper } from 'vite-plugin-wrapper'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

function pluginUnwrapProdOptions(serverFilePath: string): Plugin {
  return wrapper({
    resolveId: {
      filter: {
        id: new RegExp(escapeRegex(serverFilePath)),
      },
    },

    // Unwrap all prod.* options, and use Vike's built-in server if +server.js doesn't define `fetch`
    load(id) {
      return `
import * as mod from ${JSON.stringify(id)};
import vikeFetch from 'vike/__internal/fetch';

export * from ${JSON.stringify(id)};
// Destructured because mod.default makes Rolldown warn when +server.js has no default export
const { default: server } = mod;
export default { ...vikeFetch, ...server, ...server?.prod };
`
    },
  })
}
