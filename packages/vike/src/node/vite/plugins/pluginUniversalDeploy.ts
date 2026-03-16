export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy from '@universal-deploy/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginVikeVirtualEntry } from './pluginUniversalDeploy/pluginVikeVirtualEntry.js'
import { getDeployConfigs } from './pluginUniversalDeploy/getDeployConfigs.js'
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
          if (deployConfigs !== null) {
            addEntry({
              id: serverEntryVike,
              ...deployConfigs,
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
