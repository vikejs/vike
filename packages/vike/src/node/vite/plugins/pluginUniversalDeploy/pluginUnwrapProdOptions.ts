export { pluginUnwrapProdOptions }

import type { Plugin } from 'vite'
import { wrapper } from 'vite-plugin-wrapper'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

function pluginUnwrapProdOptions(serverFilePath: string): Plugin {
  return wrapper({
    resolveId: {
      filter: {
        // Anchored, so that the wrapper isn't itself wrapped again (e.g. Universal Deploy's catch-all imports `+server.js?wrapper_N`)
        id: new RegExp(`${escapeRegex(serverFilePath)}$`),
      },
    },

    // - Unwrap all prod.* options
    // - +server.js > `upgrade()` in production (in development, see pluginUpgradeDev.ts) — https://vike.dev/server#websockets
    load(id) {
      return `
import mod from ${JSON.stringify(id)};

export * from ${JSON.stringify(id)};
const server = { ...mod, ...mod?.prod };
if (mod?.upgrade) {
  const { onCreate } = server;
  server.onCreate = (srvxServer) => {
    const httpServer = srvxServer.node?.server;
    if (httpServer) {
      httpServer.on('upgrade', (req, socket, head) => mod.upgrade(req, socket, head));
    } else {
      console.warn("[vike][Warning] +server.js > upgrade() is ignored: it requires Node.js's HTTP server, see https://vike.dev/server#websockets");
    }
    return onCreate?.(srvxServer);
  };
}
export default server;
`
    },
  })
}
