export { importUserCode }

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'
import { getConfigVps } from '../config/getConfigVps'
import { generatePageConfigVirtualFile } from './page-configs'
import { getPageFilesVirtualFile } from './page-files/getPageFilesVirtualFile'
import { getVirtualFileId, isDev1, isDev1_onConfigureServer, isVirtualFileId, resolveVirtualFileId } from '../../utils'
import { invalidateCodeImporters } from './page-configs/invalidation'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  let server: ViteDevServer
  return {
    name: 'vite-plugin-ssr:importUserCode',
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
      if (isVirtualFileId(id)) {
        return resolveVirtualFileId(id)
      }
    },
    /* TODO: remove
    configureServer(server) {
      server.watcher.on('change', (filePath) => {
        console.log('filePath', filePath)
        // server.moduleGraph.onFileChange(virtualModuleIdImportUserCodeServer)
        // server.moduleGraph.onFileChange(virtualModuleIdImportUserCodeClientCR)
      })
    },
    */
    async load(id, options) {
      const isDev = isDev1()

      if (!isVirtualFileId(id)) return undefined
      id = getVirtualFileId(id)

      if (id.startsWith('virtual:vite-plugin-ssr:pageCodeFilesImporter:')) {
        const code = await generatePageConfigVirtualFile(
          id,
          config.root,
          isDev,
          configVps.includeAssetsImportedByServer
        )
        return code
      }

      if (id.startsWith('virtual:vite-plugin-ssr:importUserCode:')) {
        if (isDev) invalidateCodeImporters(server)
        const code = await getPageFilesVirtualFile(id, options, configVps, config, isDev)
        return code
      }
    },
    configureServer(server_) {
      server = server_
      isDev1_onConfigureServer()
    }
  }
}
