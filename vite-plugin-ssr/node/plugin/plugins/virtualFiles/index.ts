export { virtualFiles }

// TODO/next-major-version: remove old `.page.js`/`.page.client.js`/`.page.server.js` interface
//  - Systematically remove all pageFilesAll references does the trick?

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'
import { getConfigVps } from '../config/assertConfigVps'
import { generatePageConfigVirtualFile } from './generatePageConfigsSourceCode'
import { generatePageFilesVirtualFile } from './generatePageFilesVirtualFile'

function virtualFiles(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  let isDev = false
  return {
    name: 'vite-plugin-ssr:virtualFiles',
    config() {
      return {
        experimental: {
          importGlobRestoreExtension: true
        }
      }
    },
    async configResolved(config_) {
      configVps = await getConfigVps(config_)
      config = config_
    },
    resolveId(id) {
      if (id.startsWith('virtual:vite-plugin-ssr:')) {
        return '\0' + id
      }
    },
    /* TODO: remove
    configureServer(server) {
      server.watcher.on('change', (filePath) => {
        console.log('filePath', filePath)
        // server.moduleGraph.onFileChange(virtualModuleIdPageFilesServer)
        // server.moduleGraph.onFileChange(virtualModuleIdPageFilesClientCR)
      })
    },
    */
    async load(id, options) {
      if (id.startsWith('\0virtual:vite-plugin-ssr:')) {
        id = id.slice('\0'.length)
      } else {
        return undefined
      }

      {
        const code = generatePageConfigVirtualFile(id, !options?.ssr)
        if (code) return code
      }

      const code = await generatePageFilesVirtualFile(id, options, configVps, config, isDev)
      return code
    },
    configureServer() {
      isDev = true
    }
  }
}
