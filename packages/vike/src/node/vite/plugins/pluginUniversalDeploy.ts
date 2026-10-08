export { pluginUniversalDeploy }

import { toRou3 } from 'convert-route'
import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy, { precompress, resolveTargets } from '@universal-deploy/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { pluginServerEntryInject } from './pluginUniversalDeploy/pluginServerEntryInject.js'
import { getDeployConfig } from './pluginUniversalDeploy/getDeployConfig.js'
import { pluginCommon } from './pluginUniversalDeploy/common.js'
import { hasVikeServerOrVikePhoton } from './pluginUniversalDeploy/detectDeprecated.js'
import { getServerConfig, getServerEntryFilePath_ifDev } from './pluginUniversalDeploy/getServerConfig.js'
import { pluginServerEntryAlias } from './pluginUniversalDeploy/pluginServerEntryAlias.js'
import { pluginUnwrapProdOptions } from './pluginUniversalDeploy/pluginUnwrapProdOptions.js'
import { getViteCliCommand } from '../shared/isViteCli.js'
import { unique } from '../../../utils/unique.js'
import { assertUsage } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
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
      precompress(vikeConfig.config.precompress),
    ]
  const { serverEntryVike, serverEntryId, serverFilePath, serverEntryFilePath } = serverConfig
  const isServerEntryDev = !!getServerEntryFilePath_ifDev(vikeConfig)
  // Vite's CLI always starts Vite's own server => it can't run +serverEntry.js
  assertUsage(
    !(isServerEntryDev && getViteCliCommand() === 'dev'),
    `${pc.cyan('+serverEntry.js')} (without ${pc.cyan('+server.js')}) requires ${pc.cyan('$ vike dev')} instead of ${pc.cyan('$ vite dev')} (because Vite's CLI always starts Vite's own server)`,
  )

  return [
    ...(!serverEntryFilePath
      ? universalDeploy({ node: { precompress: vikeConfig.config.precompress } })
      : [
          // +serverEntry.js is the production server entry dist/server/index.mjs (instead of @universal-deploy/node's server)
          // https://vike.dev/serverEntry
          ...universalDeploy({
            entry: {
              id: serverEntryFilePath,
              // Without +server.js, +serverEntry.js handles requests itself (it calls renderPage() instead of using vike:server) and `$ vike dev` runs it
              catchAll: !isServerEntryDev,
            },
          }),
          precompress(vikeConfig.config.precompress),
          resolveTargets((targets) => {
            const target = targets[0]
            assertUsage(
              target === undefined,
              `+serverEntry cannot be used with ${target} (because it uses its own server entry)`,
            )
          }),
          // dist/server/index.mjs loads dist/server/entry.mjs
          pluginServerEntryInject(serverEntryFilePath),
        ]),
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
  ].filter((p) => p !== null)
}
