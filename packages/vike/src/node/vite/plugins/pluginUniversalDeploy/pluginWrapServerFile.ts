export { pluginWrapServerFile }

import type { Plugin } from 'vite'
import { wrapper } from 'vite-plugin-wrapper'
import { escapeRegex } from '../../../../utils/escapeRegex.js'
import '../../assertEnvVite.js'

function pluginWrapServerFile(serverFilePath: string): Plugin {
  return wrapper({
    resolveId: {
      filter: {
        id: new RegExp(`${escapeRegex(serverFilePath)}$`),
      },
    },
    load(id) {
      return [
        // === Side exports
        `export * from ${JSON.stringify(id)};`,
        '',
        // === Default export
        // `vikeFetch` acts as fallback if the user's +server.js doesn't export `fetch`
        // - Example: https://vike.dev/cloudflare#durable-objects
        // - Bloat (when `vikeFetch` isn't used) is negligible
        "import vikeFetch from 'vike/__internal/fetch';",
        `import * as mod from ${JSON.stringify(id)};`,
        // Destructured because mod.default makes Rolldown warn when +server.js has no default export
        'const { default: server } = mod;',
        'export default { ...server, ...server?.prod, fetch: server?.fetch ?? vikeFetch.fetch };',
      ].join('\n')
    },
  })
}
