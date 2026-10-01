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
import { runMiddlewares } from 'vike/__internal';

export * from ${JSON.stringify(id)};
const server = { ...mod, ...mod?.prod };
const { fetch } = server;
if (fetch) server.fetch = (request, ...args) => runMiddlewares(request, () => fetch.call(server, request, ...args));
export default server;
`
    },
  })
}
