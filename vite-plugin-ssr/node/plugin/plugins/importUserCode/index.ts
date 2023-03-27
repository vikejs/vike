export { importUserCode }

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { ConfigVpsResolved } from '../../../../shared/ConfigVps'
import { getConfigVps } from '../../../shared/getConfigVps'
import { getVirtualFileImportPageCode } from './v1-design/getVirtualFileImportPageCode'
import { getVirtualFileImportUserCode } from './getVirtualFileImportUserCode'
import { getVirtualFileId, isDev1, isDev1_onConfigureServer, isVirtualFileId, resolveVirtualFileId } from '../../utils'
import { invalidateVirtualFilesImportPageCode } from './v1-design/invalidation'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode'

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
        const code = await getVirtualFileImportPageCode(id, config.root, isDev, configVps)
        return code
      }

      if (isVirtualFileIdImportUserCode(id)) {
        if (isDev) invalidateVirtualFilesImportPageCode(server)
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
