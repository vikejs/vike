import { toRou3 } from 'convert-route'

export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy from '@universal-deploy/vite'
import { fromVike } from 'convert-route/vike'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginVikeVirtualEntry } from './pluginUniversalDeploy/pluginVikeVirtualEntry.js'
import { dedupeRoute, getDeployConfigs, getPageContextRoute } from './pluginUniversalDeploy/getDeployConfigs.js'
import { pluginCommon } from './pluginUniversalDeploy/common.js'
import { hasVikeServerOrVikePhoton } from './pluginUniversalDeploy/detectDeprecated.js'
import { getServerInfo } from './pluginUniversalDeploy/getServerInfo.js'

import '../assertEnvVite.js'

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
            const pageContextRouteIr = getPageContextRoute(routeIr)
            addEntry({
              ...additionalConfigs,
              id: serverEntryVike,
              // Map Vike routes to rou3 format
              route: dedupeRoute(...toRou3(routeIr), ...(pageContextRouteIr ? toRou3(pageContextRouteIr) : [])),
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
    pluginVikeVirtualEntry(serverEntryId),
  ]

  if (serverFilePath) {
    plugins.push(pluginVikeVirtualEntry(serverFilePath))
  }

  return plugins
}
