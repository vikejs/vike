export { pluginAutoTarget }

import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from 'vite'
import { node } from '@universal-deploy/node/vite'
import { assertUsage } from '../../../utils/assert.js'
import { asyncFlatten } from '../../../utils/asyncFlatten.js'
import '../assertEnvVite.js'

function pluginAutoTarget(): Plugin[] {
  // Disable @universal-deploy/node if one of the following plugin is present
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

  return node().map((p) => disablePluginIf(condition, p))
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
