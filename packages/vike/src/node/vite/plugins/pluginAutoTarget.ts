export { pluginAutoTarget }

import type { Plugin } from 'vite'
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

          return import('@universal-deploy/node/vite').then((p) => p.node())
        },
      },

      sharedDuringBuild: true,
    },
  ]
}

function isDependencyInstalledByUser(packageJson: Record<string, unknown>, pkg: string): boolean {
  for (const prop of ['devDependencies', 'dependencies']) {
    if (packageJson[prop] && Object.keys(packageJson[prop]).includes(pkg)) {
      return true
    }
  }
  return false
}
