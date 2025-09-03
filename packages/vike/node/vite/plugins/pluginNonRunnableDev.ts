export { pluginNonRunnableDev }

import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite'
import {
  createViteRPC,
  assertIsNotProductionRuntime,
  requireResolveDistFile,
  isRunnableDevEnvironment,
  assert,
} from '../utils.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { retrievePageAssetsDev } from '../../runtime/renderPage/getPageAssets/retrievePageAssetsDev.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'
import { getMagicString } from '../shared/getMagicString.js'
assertIsNotProductionRuntime()

export type ViteRPC = ReturnType<typeof getViteRpcFunctions>
function getViteRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtmlRPC(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
    async retrievePageAssetsDevRPC(clientDependencies: ClientDependency[], clientEntries: string[]) {
      return await retrievePageAssetsDev(viteDevServer, clientDependencies, clientEntries)
    },
    async getViteConfigRuntimeRPC() {
      return getViteConfigRuntime(viteDevServer.config)
    },
  }
}

declare global {
  var __VIKE__DYNAMIC_IMPORT: (module: string) => Promise<Record<string, unknown>>
  var __VIKE__IS_NON_RUNNABLE_DEV: undefined | boolean
}
function pluginNonRunnableDev(): Plugin {
  const distFileIsNonRunnableDev = requireResolveDistFile('dist/esm/utils/isNonRunnableDev.js')
  const distFileGlobalContext = requireResolveDistFile('dist/esm/node/runtime/globalContext.js')

  const filterRolldown = {
    id: {
      include: [distFileIsNonRunnableDev, distFileGlobalContext],
    },
  }
  const filterFunction = (id: string) => {
    const idWithoutQuery = id.split('?')[0]!
    return idWithoutQuery === distFileIsNonRunnableDev || idWithoutQuery === distFileGlobalContext
  }

  let config: ResolvedConfig
  return {
    name: 'vike:pluginNonRunnableDev',
    configureServer: {
      handler(viteDevServer) {
        createViteRPC(viteDevServer, getViteRpcFunctions)
      },
    },
    configResolved: {
      handler(config_) {
        config = config_
      },
    },
    transform: {
      filter: filterRolldown,
      handler(code, id) {
        if (!config._isDev) return
        assert(filterFunction(id))
        const idWithoutQuery = id.split('?')[0]!
        if (isRunnableDevEnvironment(this.environment)) return
        const { magicString, getMagicStringResult } = getMagicString(code, id)
        if (idWithoutQuery === distFileIsNonRunnableDev) {
          magicString.replaceAll('__VIKE__IS_NON_RUNNABLE_DEV', JSON.stringify(true))
        }
        if (idWithoutQuery === distFileGlobalContext) {
          magicString.replaceAll('__VIKE__DYNAMIC_IMPORT', 'import')
        }
        return getMagicStringResult()
      },
    },
  }
}
