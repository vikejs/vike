export { pluginUniversalDeploy }

import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from 'vite'
import { addEntry } from '@universal-deploy/store'
import { node } from '@universal-deploy/node/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId as vikeEntryId } from '@brillout/vite-plugin-server-entry/plugin'
import { getMagicString } from '../shared/getMagicString.js'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { getDeployConfigs } from './pluginUniversalDeploy/getDeployConfigs.js'
import { assert, assertUsage, assertWarning } from '../../../utils/assert.js'
import { asyncFlatten } from '../../../utils/asyncFlatten.js'
import '../assertEnvVite.js'
import pc from '@brillout/picocolors'

const virtualFileIdCatchAll = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  if (hasVikeServerOrVikePhoton(vikeConfig)) return []

  const serverConfig = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  let serverEntryId = virtualFileIdCatchAll
  let serverFilePath: string | null = null

  const { server } = vikeConfig.config
  if (server === false) return []
  if (server !== true && serverConfig) {
    assert('filePathAbsoluteFilesystem' in serverConfig.definedAt)
    serverFilePath = serverConfig.definedAt.filePathAbsoluteFilesystem
    if (serverFilePath) serverEntryId = new RegExp(escapeRegex(serverFilePath))
  }
  if (server !== true && !serverFilePath) return []

  const plugins: Plugin[] = [
    catchAll(),
    devServer(),
    // Enable node adapter only if +server is defined and no other deployment target has been found
    ...node({ importer: 'vike' }).map((p) =>
      // Disable node() plugin later when Vite's config() hook runs, because noDeploymentTargetFound() requires `config`
      enablePluginIf((config) => noDeploymentTargetFound(config), p),
    ),
    {
      name: 'vike:pluginUniversalDeploy:entries',
      config() {
        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const deployConfigs = getDeployConfigs(pageId, page)

          if (deployConfigs !== null) {
            addEntry({
              id: 'vike/fetch',
              ...deployConfigs,
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
            include: serverEntryId,
          },
        },
        handler(code, id) {
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          // Inject Vike virtual server entry
          magicString.prepend(`import "${vikeEntryId}";\n`)
          return getMagicStringResult()
        },
      },

      sharedDuringBuild: true,
    },
  ]

  if (serverFilePath) {
    plugins.push(
      // If +server is defined, virtual:ud:catch-all resolve to +server absolute path
      {
        name: 'vike:pluginUniversalDeploy:server',
        resolveId: {
          order: 'pre',
          filter: {
            id: virtualFileIdCatchAll,
          },
          handler() {
            // Will resolve the entry from the users project root
            return this.resolve(serverFilePath)
          },
        },

        sharedDuringBuild: true,
      },
    )
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
  const plugins = (await asyncFlatten((c.plugins ?? []) as Plugin[])).filter((p): p is Plugin => Boolean(p))

  assertUsage(
    !plugins.some((p) => p.name.startsWith('photon:target-loader:vercel')),
    'Replace `@photonjs/vercel` by `vite-plugin-vercel@11`, see https://vike.dev/migration/universal-deploy',
  )
  assertUsage(
    !plugins.some((p) => p.name.startsWith('photon:target-loader:cloudflare')),
    'Replace `@photonjs/cloudflare` by `@cloudflare/vite-plugin`, see https://vike.dev/migration/universal-deploy',
  )

  // vite-plugin-vercel
  const vitePluginVercel = plugins.some((p) => p.name.match(/^vite-plugin-vercel:(?!.*:disabled$)/))
  // @cloudflare/vite-plugin
  const cloudflareVitePlugin = plugins.some((p) => p.name.match(/^vite-plugin-cloudflare:(?!.*:disabled$)/))

  return !vitePluginVercel && !cloudflareVitePlugin
}

function hasVikeServerOrVikePhoton(vikeConfig: VikeConfigInternal) {
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
      `${pc.cyan(vikeServerOrVikePhoton)} is deprecated, see ${pc.underline('https://vike.dev/migration/universal-deploy')}`,
      { onlyOnce: true },
    )
    return true
  }
}
