export { importUserCode }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsResolved } from '../../../../shared/ConfigVps'
import { getConfigVps } from '../../../shared/getConfigVps'
import { getVirtualFileImportCodeFiles } from './v1-design/getVirtualFileImportCodeFiles'
import { getVirtualFileImportUserCode } from './getVirtualFileImportUserCode'
import {
  assert,
  getVirtualFileId,
  isDev1,
  isDev1_onConfigureServer,
  isVirtualFileId,
  resolveVirtualFileId
} from '../../utils'
import { isVirtualFileIdImportPageCode } from '../../../shared/virtual-files/virtualFileImportPageCode'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode'
import { getConfigData_dependenciesInvisibleToVite, getConfigData_invalidate } from './v1-design/getConfigData'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
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
    handleHotUpdate(ctx) {
      if (!getConfigData_dependenciesInvisibleToVite.has(ctx.file)) {
        return
      }
      getConfigData_invalidate()
      const mods = Array.from(ctx.server.moduleGraph.urlToModuleMap.keys())
        .filter((url) => isVirtualFileIdImportPageCode(url) || isVirtualFileIdImportUserCode(url))
        .map((url) => {
          const mod = ctx.server.moduleGraph.urlToModuleMap.get(url)
          assert(mod)
          return mod
        })
      return mods
    },
    async load(id, options) {
      const isDev = isDev1()

      if (!isVirtualFileId(id)) return undefined
      id = getVirtualFileId(id)

      if (isVirtualFileIdImportPageCode(id)) {
        const code = await getVirtualFileImportCodeFiles(id, config.root, isDev, configVps)
        return code
      }

      if (isVirtualFileIdImportUserCode(id)) {
        const code = await getVirtualFileImportUserCode(id, options, configVps, config, isDev)
        return code
      }
    },
    configureServer() {
      isDev1_onConfigureServer()
    }
  }
}
