export { manifest }
export { assertPluginManifest }

import { Plugin } from 'vite'
import { assert, assertUsage, isPlainObject, normalizePath, projectInfo, isSSR_config } from '../utils'

function manifest({ baseAssets }: { baseAssets: string | null }): Plugin {
  let base: string
  let ssr: boolean
  return {
    name: 'vite-plugin-ssr:manifest',
    apply: 'build',
    configResolved(config) {
      base = config.base
      ssr = isSSR_config(config)
    },
    generateBundle(_, bundle) {
      if (ssr) return
      assert(typeof base === 'string')
      assert(typeof ssr === 'boolean')
      const manifest = {
        version: projectInfo.projectVersion,
        usesClientRouter: includesClientSideRouter(bundle as any),
        base,
        baseAssets,
      }
      this.emitFile({
        fileName: `vite-plugin-ssr.json`,
        type: 'asset',
        source: JSON.stringify(manifest, null, 2),
      })
    },
  } as Plugin
}

function includesClientSideRouter(bundle: Record<string, { modules?: Record<string, unknown> }>) {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const filePath = require.resolve('../../../../../dist/esm/client/router/useClientRouter.js')
  for (const file of Object.keys(bundle)) {
    const bundleFile = bundle[file]
    assert(bundleFile)
    const modules = bundleFile.modules || {}
    if (filePath in modules || normalizePath(filePath) in modules) {
      return true
    }
  }
  return false
}

type PluginManifest = {
  version: string
  base: string
  baseAssets: string
  usesClientRouter: boolean
}
function assertPluginManifest(pluginManifest: unknown): asserts pluginManifest is PluginManifest {
  assert(isPlainObject(pluginManifest))
  assert(typeof pluginManifest.base === 'string')
  assert(pluginManifest.base.startsWith('/'))
  assert(typeof pluginManifest.usesClientRouter === 'boolean')
  assert(typeof pluginManifest.version === 'string')
  assert(pluginManifest.baseAssets === null || typeof pluginManifest.baseAssets === 'string')
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.projectVersion}\` but your build has been generated with following different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`,
  )
}
