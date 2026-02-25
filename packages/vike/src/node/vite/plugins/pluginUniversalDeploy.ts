export { pluginUniversalDeploy }

import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from 'vite'
import { addEntry } from '@universal-deploy/store'
import { node } from '@universal-deploy/node/vite'
import { getVikeConfigInternal, VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import MagicString from 'magic-string'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { pageConfigToUniversalDeploy } from './pluginUniversalDeploy/pageConfigToUniversalDeploy.js'
import { assertUsage } from '../../../utils/assert.js'
import { asyncFlatten } from '../../../utils/asyncFlatten.js'
import '../assertEnvVite.js'

const catchAllRE = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  return [
    {
      name: 'vike:pluginUniversalDeploy',
      async config() {
        const vikeConfig = await getVikeConfigInternal()

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
    ...pluginUniversalDeployServer(vikeConfig),
    catchAll(),
  ]
}

function pluginUniversalDeployServer(vikeConfig: VikeConfigInternal): Plugin[] {
  const serverConfig = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]?.definedAt
  const vikeExtends = vikeConfig.config.extends
    ? Array.isArray(vikeConfig.config.extends)
      ? vikeConfig.config.extends
      : [vikeConfig.config.extends]
    : []
  let filterRolldownId = catchAllRE
  let serverPath: string | null = null
  // TODO if target supporting UD are used, like vite-plugin-vercel@11, we should also install some of those plugins
  if (serverConfig && 'filePathAbsoluteFilesystem' in serverConfig) {
    serverPath = serverConfig['filePathAbsoluteFilesystem']

    // +server was also used by vike-server and vike-photon
    const vikeExtendsNames = new Set(vikeExtends.map((vikePlugin) => vikePlugin.name))
    if (vikeExtendsNames.has('vike-server') || vikeExtendsNames.has('vike-photon')) return []

    if (serverPath) {
      filterRolldownId = new RegExp(escapeRegex(serverPath))
    }
  }

  return [
    {
      name: 'vike:pluginUniversalDeploy:server',
      resolveId: {
        order: 'pre',
        filter: {
          id: catchAllRE,
        },
        handler() {
          if (serverPath) {
            // Will resolve the entry from the users project root
            return this.resolve(serverPath)
          }
        },
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
    devServer(),
    ...node().map((p) => disablePluginIf(condition, p)),
  ]
}

type DisableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>

/**
 * Disables a plugin based on a specified condition callback which will be executed in the `config` hook.
 */
function disablePluginIf(condition: DisableCondition, originalPlugin: Plugin): Plugin {
  const originalConfig = originalPlugin.config

  originalPlugin.config = {
    order: originalConfig && 'order' in originalConfig ? originalConfig.order : 'pre',
    async handler(c, e) {
      const disabled = await condition.call(this, c, e)
      if (disabled) {
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
async function condition(c: UserConfig) {
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

  return vitePluginVercel || cloudflareVitePlugin
}
