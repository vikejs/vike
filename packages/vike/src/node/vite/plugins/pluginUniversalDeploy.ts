export { pluginUniversalDeploy }

import { toRou3 } from 'convert-route'
import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy, { resolveTargets } from '@universal-deploy/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginServerEntryInject } from './pluginUniversalDeploy/pluginServerEntryInject.js'
import { getDeployConfig } from './pluginUniversalDeploy/getDeployConfig.js'
import { pluginCommon } from './pluginUniversalDeploy/common.js'
import { hasVikeServerOrVikePhoton } from './pluginUniversalDeploy/detectDeprecated.js'
import { getServerConfig } from './pluginUniversalDeploy/getServerConfig.js'
import { pluginServerEntryAlias } from './pluginUniversalDeploy/pluginServerEntryAlias.js'
import { pluginUnwrapProdOptions } from './pluginUniversalDeploy/pluginUnwrapProdOptions.js'
import { pluginNetlifyGlue } from './pluginUniversalDeploy/pluginNetlifyGlue.js'
import { unique } from '../../../utils/unique.js'
import { assertUsage } from '../../../utils/assert.js'
import '../assertEnvVite.js'

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  if (hasVikeServerOrVikePhoton(vikeConfig)) return []

  const serverConfig = getServerConfig(vikeConfig)
  if (!serverConfig)
    return [
      resolveTargets((targets) => {
        // Cloudflare is supported even without universal-deploy
        const target = targets.filter((t) => t !== '@cloudflare/vite-plugin')[0]
        assertUsage(target === undefined, `${target} requires +server — see https://vike.dev/server`)
      }),
    ]
  const { serverEntryVike, serverEntryId, serverFilePath } = serverConfig

  return [
    ...universalDeploy(),
    {
      name: 'vike:pluginUniversalDeploy:entries',
      config() {
        // Map each Vike route to universal-deploy
        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const deployConfig = getDeployConfig(pageId, page)
          // Skip pages without a deploy configuration, as they will be handled by the catch-all route
          if (deployConfig) {
            const { route, ...config } = deployConfig
            addEntry({
              ...config,
              id: serverEntryVike,
              // Map Vike routes to rou3 format
              route: unique(route.map(toRou3).flat()),
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
    pluginServerEntryAlias(serverFilePath),
    !serverFilePath ? null : pluginUnwrapProdOptions(serverFilePath),
    ...pluginNetlifyGlue(),
  ].filter((p) => p !== null)
}
