export { assertPluginManifest }

import { assert, assertUsage, isPlainObject, projectInfo } from '../../utils'

type PluginManifest = {
  version: string
  baseUrl: string
  baseAssets: string
  usesClientRouter: boolean
}
function assertPluginManifest(pluginManifest: unknown): asserts pluginManifest is PluginManifest {
  assert(isPlainObject(pluginManifest))
  assert(typeof pluginManifest.baseUrl === 'string')
  assert(pluginManifest.baseUrl.startsWith('/'))
  assert(typeof pluginManifest.usesClientRouter === 'boolean')
  assert(typeof pluginManifest.version === 'string')
  assert(
    pluginManifest.baseAssets === null ||
      (typeof pluginManifest.baseAssets === 'string' && pluginManifest.baseAssets.startsWith('http')),
  )
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.projectVersion}\` but your build has been generated with following different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`,
  )
}
