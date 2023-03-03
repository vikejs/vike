export { virtualFiles }

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'
import { getConfigVps } from '../config/getConfigVps'
import { generatePageConfigVirtualFile } from './generatePageConfigsSourceCode'
import { generatePageFilesVirtualFile } from './generatePageFilesVirtualFile'
import { assert, isDev1, isDev1_onConfigureServer } from '../../utils'
import { invalidateCodeImporters } from './generatePageConfigsSourceCode/invalidation'

function virtualFiles(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  let server: ViteDevServer
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
      const isDev = isDev1()
      if (!id.startsWith('\0virtual:vite-plugin-ssr:')) {
        return
      }
      id = id.slice('\0'.length)
      if (id.startsWith('virtual:vite-plugin-ssr:pageCodeFilesImporter:')) {
        const code = await generatePageConfigVirtualFile(
          id,
          config.root,
          isDev,
          configVps.includeAssetsImportedByServer
        )
        return code
      }
      if (id.startsWith('virtual:vite-plugin-ssr:pageFiles:')) {
        if (isDev) invalidateCodeImporters(server)
        const code = await generatePageFilesVirtualFile(id, options, configVps, config, isDev)
        return code
      }
      assert(false)
    },
    configureServer(server_) {
      server = server_
      isDev1_onConfigureServer()
    }
  }
}
