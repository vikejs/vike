export { pluginUniversalDeploy }

import { toRou3 } from 'convert-route'
import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy, { resolveTargets } from '@universal-deploy/vite'
import { fromVike } from 'convert-route/vike'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginServerEntryInject } from './pluginUniversalDeploy/pluginServerEntryInject.js'
import { getDeployConfigs, getRoutePageContextJson } from './pluginUniversalDeploy/getDeployConfigs.js'
import { pluginCommon } from './pluginUniversalDeploy/common.js'
import { hasVikeServerOrVikePhoton } from './pluginUniversalDeploy/detectDeprecated.js'
import { getServerConfig } from './pluginUniversalDeploy/getServerConfig.js'
import { pluginServerEntryAlias } from './pluginUniversalDeploy/pluginServerEntryAlias.js'
import { pluginUnwrapProdOptions } from './pluginUniversalDeploy/pluginUnwrapProdOptions.js'
import { unique } from '../../../utils/unique.js'
import { assertUsage } from '../../../utils/assert.js'
import '../assertEnvVite.js'

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  if (hasVikeServerOrVikePhoton(vikeConfig)) return []
  const serverInfo = getServerConfig(vikeConfig)

  if (!serverInfo)
    return [
      resolveTargets(({ vercel, node, netlify }) => {
        // Cloudflare is supported even without universal-deploy
        const target = vercel ? 'Vercel' : node ? 'Node.js' : netlify ? 'Netlify' : null
        assertUsage(
          target === null,
          `Cannot target ${target} without a server entry. Either set \`server: true\` in +config.js or create a \`+server.js\` file.`,
        )
      }),
    ]

  const { serverEntryVike, serverEntryId, serverFilePath } = serverInfo

  return [
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
    !serverFilePath ? null : pluginUnwrapProdOptions(serverFilePath),
  ].filter((p) => p !== null)
}
