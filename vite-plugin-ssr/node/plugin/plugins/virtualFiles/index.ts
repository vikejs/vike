export { virtualFiles }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'
import { getConfigVps } from '../config/getConfigVps'
import { generatePageConfigVirtualFile } from './generatePageConfigsSourceCode'
import { generatePageFilesVirtualFile } from './generatePageFilesVirtualFile'
import { assert } from '../../utils'

function virtualFiles(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  let isDev = false
  let loadHookWasCalled = false
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
      loadHookWasCalled = true
      if (id.startsWith('\0virtual:vite-plugin-ssr:')) {
        id = id.slice('\0'.length)
      } else {
        return undefined
      }

      {
        const code = await generatePageConfigVirtualFile(id, !options?.ssr, config.root, isDev)
        if (code) return code
      }

      const code = await generatePageFilesVirtualFile(id, options, configVps, config, isDev)
      return code
    },
    configureServer() {
      isDev = true
      assert(loadHookWasCalled === false)
    }
  }
}
