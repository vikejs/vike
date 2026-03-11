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

  let serverEntryId: RegExp
  let serverFilePath: string | null = null
  const serverConfig = vikeConfig.config.server
  if (serverConfig === false) return []
  const serverPlusFile = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  if (serverPlusFile) {
    assert('filePathAbsoluteFilesystem' in serverPlusFile.definedAt)
    serverFilePath = serverPlusFile.definedAt.filePathAbsoluteFilesystem
    assert(serverFilePath)
    serverEntryId = new RegExp(escapeRegex(serverFilePath))
  } else {
    serverEntryId = virtualFileIdCatchAll
  }
  if (serverConfig !== true && !serverFilePath) return []

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
              id: serverFilePath ?? 'vike/fetch',
              ...deployConfigs,
            })
          }
        }
        // Default catch-all route
        addEntry({
          id: serverFilePath ?? 'vike/fetch',
          route: '/**',
        })
      },
      ...pluginOptions,
    },
    {
      name: 'vike:pluginUniversalDeploy:serverEntry',
      apply: 'build',
      transform: {
        order: 'post',
        filter: {
          id: {
            include: [serverEntryId],
          },
        },
        handler(code, id) {
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          // Inject Vike virtual server entry
          magicString.prepend(`import "${vikeEntryId}";\n`)
          return getMagicStringResult()
        },
      },
      ...pluginOptions,
    },
  ]

  if (serverFilePath) {
    plugins.push(
      // If +server.js is defined, make virtual:ud:catch-all resolve to +server.js absolute path
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
        ...pluginOptions,
      },
    )
  }

  return plugins
}

const pluginOptions = {
  applyToEnvironment(env) {
    return env.config.consumer === 'server'
  },
  sharedDuringBuild: true,
} satisfies Partial<Plugin>

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
type EnableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>

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
