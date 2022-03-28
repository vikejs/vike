export { assertPluginManifest }

import { assert, assertUsage, isPlainObject, projectInfo } from '../../utils'

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
