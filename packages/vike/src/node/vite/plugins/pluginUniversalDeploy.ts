export { pluginUniversalDeploy }

import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from 'vite'
import { addEntry } from '@universal-deploy/store'
import { node } from '@universal-deploy/node/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import MagicString from 'magic-string'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { pageConfigToUniversalDeploy } from './pluginUniversalDeploy/pageConfigToUniversalDeploy.js'
import { assertUsage, assertWarning } from '../../../utils/assert.js'
import { asyncFlatten } from '../../../utils/asyncFlatten.js'
import '../assertEnvVite.js'

const catchAllRE = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  const serverConfig = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]?.definedAt
  // +server was also used by vike-server and vike-photon
  const vikeExtendsNames = new Set(
    vikeConfig._extensions.map(
      (plusFile) => ('fileExportsByConfigName' in plusFile ? plusFile.fileExportsByConfigName : {}).name,
    ),
  )
  const vikeServerOrVikePhoton = vikeExtendsNames.has('vike-server')
    ? 'vike-server'
    : vikeExtendsNames.has('vike-photon')
      ? 'vike-photon'
      : null
  if (vikeServerOrVikePhoton) {
    assertWarning(
      false,
      `\`${vikeServerOrVikePhoton}\` is deprecated. See https://vike.dev/migration/universal-deploy`,
      { onlyOnce: true },
    )
    return []
  }

  let filterRolldownId = catchAllRE
  let serverPath: string | null = null
  let isServerConfigEnabled = false

  if (vikeConfig.config.server === false) {
    return []
  } else if (vikeConfig.config.server === true) {
    isServerConfigEnabled = true
  } else if (serverConfig && 'filePathAbsoluteFilesystem' in serverConfig) {
    serverPath = serverConfig['filePathAbsoluteFilesystem']

    if (serverPath) {
      isServerConfigEnabled = true
      filterRolldownId = new RegExp(escapeRegex(serverPath))
    }
  }

  const plugins: Plugin[] = [
    {
      name: 'vike:pluginUniversalDeploy',
      config() {
        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const additionalConfig = pageConfigToUniversalDeploy(pageId, page)

          if (additionalConfig !== null) {
            addEntry({
              id: 'vike/fetch',
              ...additionalConfig,
            })
          }
        }

        // Default catch-all route
        addEntry({
          id: 'vike/fetch',
          route: '/**',
        })
      },

      sharedDuringBuild: true,
    },
    {
      name: 'vike:pluginUniversalDeploy:serverEntry',
      apply: 'build',

      applyToEnvironment(env) {
        return env.config.consumer === 'server'
      },

      transform: {
        order: 'post',
        filter: {
          id: {
            include: filterRolldownId,
          },
        },
        handler(code, id) {
          const ms = new MagicString(code)
          // Inject Vike virtual server entry
          ms.prepend(`import "${serverEntryVirtualId}";\n`)

          return {
            code: ms.toString(),
            map: ms.generateMap({
              hires: true,
              source: id,
            }),
          }
        },
      },

      sharedDuringBuild: true,
    },
    catchAll(),
    // Enable node adapter only if +server is defined and no other deployment target has been found
    ...node({ importer: 'vike' }).map((p) =>
      enablePluginIf((c) => isServerConfigEnabled && noDeploymentTargetFound(c), p),
    ),
  ]

  if (serverPath) {
    plugins.push(
      // If +server is defined, virtual:ud:catch-all resolve to +server absolute path
      {
        name: 'vike:pluginUniversalDeploy:server',
        resolveId: {
          order: 'pre',
          filter: {
            id: catchAllRE,
          },
          handler() {
            // Will resolve the entry from the users project root
            return this.resolve(serverPath)
          },
        },

        sharedDuringBuild: true,
      },
    )
  }

  if (isServerConfigEnabled) {
    plugins.push(devServer())
  }

  return plugins
}

type EnableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>

/**
 * Enables a plugin based on a specified condition callback which will be executed in the `config` hook.
 */
function enablePluginIf(condition: EnableCondition, originalPlugin: Plugin): Plugin {
  const originalConfig = originalPlugin.config

  originalPlugin.config = {
    order: originalConfig && 'order' in originalConfig ? originalConfig.order : 'pre',
    async handler(c, e) {
      const enabled = await condition.call(this, c, e)
      if (!enabled) {
        const keysToDelete = Object.keys(originalPlugin).filter((k) => k !== 'name')
        originalPlugin.name += ':disabled'
        for (const key of keysToDelete) {
          // @ts-expect-error
          delete originalPlugin[key]
        }
      } else if (originalConfig) {
        if (typeof originalConfig === 'function') {
          return originalConfig.call(this, c, e)
        }
        return originalConfig.handler.call(this, c, e)
      }
    },
  }

  return originalPlugin
}

// Disable a plugin if one of the following plugin is present
//  - vite-plugin-vercel
//  - @cloudflare/vite-plugin
async function noDeploymentTargetFound(c: UserConfig) {
  const plugins = await asyncFlatten((c.plugins ?? []) as Plugin[])
  const resolvedPlugins = plugins.filter((p): p is Plugin => Boolean(p))

  const photonVercel = resolvedPlugins.some((p) => p.name.startsWith('photon:target-loader:vercel'))
  const photonCloudflare = resolvedPlugins.some((p) => p.name.startsWith('photon:target-loader:cloudflare'))

  assertUsage(!photonVercel, 'Replace `@photonjs/vercel` by `vite-plugin-vercel@11`. See https://vike.dev/vercel')
  assertUsage(
    !photonCloudflare,
    'Replace `@photonjs/cloudflare` by `@cloudflare/vite-plugin`. See https://vike.dev/cloudflare',
  )

  // vite-plugin-vercel
  const vitePluginVercel = resolvedPlugins.some((p) => p.name.match(/^vite-plugin-vercel:(?!.*:disabled$)/))
  // @cloudflare/vite-plugin
  const cloudflareVitePlugin = resolvedPlugins.some((p) => p.name.match(/^vite-plugin-cloudflare:(?!.*:disabled$)/))

  return !vitePluginVercel && !cloudflareVitePlugin
}
