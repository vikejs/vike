export { pluginAutoTarget }

import type { ConfigEnv, ConfigPluginContext, Plugin, UserConfig } from 'vite'
import { assert, assertUsage } from '../../../utils/assert.js'
import { findPackageJson } from '../../../utils/findPackageJson.js'
import '../assertEnvVite.js'

function pluginAutoTarget(): Plugin[] {
  return [
    {
      name: 'vike:pluginAutoTarget',
      configResolved: {
        async handler(config) {
          const packageJson = findPackageJson(config.root)
          assert(packageJson)

          const photonVercel = isDependencyInstalledByUser(packageJson.packageJson, '@photonjs/vercel')
          const photonCloudflare = isDependencyInstalledByUser(packageJson.packageJson, '@photonjs/cloudflare')
          const vitePluginVercel = isDependencyInstalledByUser(packageJson.packageJson, 'vite-plugin-vercel')
          const cloudflareVitePlugin = isDependencyInstalledByUser(packageJson.packageJson, '@cloudflare/vite-plugin')

          assertUsage(
            !photonVercel,
            'Replace `@photonjs/vercel` by `vite-plugin-vercel@11`. See https://vike.dev/vercel',
          )
          assertUsage(
            !photonCloudflare,
            'Replace `@photonjs/cloudflare` by `@cloudflare/vite-plugin`. See https://vike.dev/cloudflare',
          )

          if (cloudflareVitePlugin) {
            // @ts-expect-error peer dependency
            return import('@cloudflare/vite-plugin').then((p) => p.cloudflare())
          }

          if (vitePluginVercel) {
            // @ts-expect-error peer dependency
            return import('vite-plugin-vercel').then((p) => p.vercel())
          }

          async function condition(c: UserConfig) {
            const plugins = await asyncFlatten((c.plugins ?? []) as Plugin[])
            const resolvedPlugins = plugins.filter((p): p is Plugin => Boolean(p))
            const found = resolvedPlugins.find(
              (p) => p.name === '@cloudflare/vite-plugin' || p.name === 'vite-plugin-vercel',
            )

            return Boolean(found)
          }

          return import('@universal-deploy/node/vite').then((p) => p.node().map((p2) => disableIf(condition, p2)))
        },
      },

      sharedDuringBuild: true,
    },
  ]
}

type AsyncFlatten<T extends unknown[]> = T extends (infer U)[] ? Exclude<Awaited<U>, U[]>[] : never

async function asyncFlatten<T extends unknown[]>(arr: T): Promise<AsyncFlatten<T>> {
  do {
    arr = (await Promise.all(arr)).flat(Infinity) as any
  } while (arr.some((v: any) => v?.then))
  return arr as unknown[] as AsyncFlatten<T>
}

function isDependencyInstalledByUser(packageJson: Record<string, unknown>, pkg: string): boolean {
  for (const prop of ['devDependencies', 'dependencies']) {
    if (packageJson[prop] && Object.keys(packageJson[prop]).includes(pkg)) {
      return true
    }
  }
  return false
}

type DisableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>

function disableIf(condition: DisableCondition, originalPlugin: Plugin): Plugin {
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
          delete p[key]
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
