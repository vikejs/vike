import { toRou3 } from 'convert-route'

export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy from '@universal-deploy/vite'
import { fromVike } from 'convert-route/vike'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginServerEntryInject } from './pluginUniversalDeploy/pluginServerEntryInject.js'
import { getDeployConfigs, getRoutePageContextJson } from './pluginUniversalDeploy/getDeployConfigs.js'
import { pluginCommon } from './pluginUniversalDeploy/common.js'
import { hasVikeServerOrVikePhoton } from './pluginUniversalDeploy/detectDeprecated.js'
import { getServerInfo } from './pluginUniversalDeploy/getServerInfo.js'
import { pluginServerEntryAlias } from './pluginUniversalDeploy/pluginServerEntryAlias.js'
import { pluginUnwrapProdOptions } from './pluginUniversalDeploy/pluginUnwrapProdOptions.js'
import '../assertEnvVite.js'
import { unique } from '../../../utils/unique.js'

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  if (hasVikeServerOrVikePhoton(vikeConfig)) return []
  const serverInfo = getServerInfo(vikeConfig)

  if (!serverInfo) return []
  const { serverEntryVike, serverEntryId, serverFilePath } = serverInfo

  const plugins: Plugin[] = [
    ...universalDeploy(),
    {
      name: 'vike:pluginUniversalDeploy:entries',
      config() {
        // Map each Vike route to universal-deploy
        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const deployConfigs = getDeployConfigs(pageId, page)
          // Skip pages without deploy configs, as they will be handled by the catch-all route
          if (deployConfigs !== null) {
            const { route, ...additionalConfigs } = deployConfigs
            const routeIr = fromVike(route)
            const routeIrPageContextJson = getRoutePageContextJson(routeIr)
            addEntry({
              ...additionalConfigs,
              id: serverEntryVike,
              // Map Vike routes to rou3 format
              route: unique([...toRou3(routeIr), ...(routeIrPageContextJson ? toRou3(routeIrPageContextJson) : [])]),
            })
          }
        }
        // Default catch-all route
        addEntry({
          id: serverEntryVike,
          route: '/**',
        })
      },
      ...pluginCommon,
    },
    pluginServerEntryInject(serverFilePath ?? serverEntryId),
    pluginServerEntryAlias(),
  ]

  if (serverFilePath) {
    plugins.push(pluginUnwrapProdOptions(serverFilePath))
  }

  return plugins
}
