export { importUserCode }

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { ConfigVpsResolved } from '../config/ConfigVps'
import { getConfigVps } from '../config/getConfigVps'
import { getVirtualFileImportPageCode } from './page-configs'
import { getVirtualFileImportUserCode } from './page-files/getPageFilesVirtualFile'
import { getVirtualFileId, isDev1, isDev1_onConfigureServer, isVirtualFileId, resolveVirtualFileId } from '../../utils'
import { invalidateCodeImporters } from './page-configs/invalidation'
import { isVirtualFileIdImportPageCode } from '../../../commons/virtual-files/virtualFileImportPageCode'
import { isVirtualFileIdImportUserCode } from '../../../commons/virtual-files/virtualFileImportUserCode'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  let server: ViteDevServer
  return {
    name: 'vite-plugin-ssr:importUserCode',
    config() {
      return {
        experimental: {
          // TODO/v1-release: remove
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
    async load(id, options) {
      const isDev = isDev1()

      if (!isVirtualFileId(id)) return undefined
      id = getVirtualFileId(id)

      if (isVirtualFileIdImportPageCode(id)) {
        const code = await getVirtualFileImportPageCode(id, config.root, isDev, configVps.includeAssetsImportedByServer)
        return code
      }

      if (isVirtualFileIdImportUserCode(id)) {
        if (isDev) invalidateCodeImporters(server)
        const code = await getVirtualFileImportUserCode(id, options, configVps, config, isDev)
        return code
      }
    },
    configureServer(server_) {
      server = server_
      isDev1_onConfigureServer()
    }
  }
}
