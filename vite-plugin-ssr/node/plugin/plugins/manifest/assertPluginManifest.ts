export { assertPluginManifest }

import { assertBaseUrlValue } from '../../../globalContext/runtimeConfig/assertBase'
import { assert, assertUsage, isPlainObject, projectInfo } from '../../utils'

type PluginManifest = {
  version: string
  baseUrl: string
  baseAssets: string
  usesClientRouter: boolean
  includeAssetsImportedByServer: boolean
  manifestKeyMap: Record<string, string>
}
function assertPluginManifest(pluginManifest: unknown): asserts pluginManifest is PluginManifest {
  assert(isPlainObject(pluginManifest))
  assert(typeof pluginManifest.baseUrl === 'string')
  assertBaseUrlValue(pluginManifest.baseUrl)
  assert(typeof pluginManifest.usesClientRouter === 'boolean')
  assert(typeof pluginManifest.version === 'string')
  assert(typeof pluginManifest.includeAssetsImportedByServer === 'boolean')
  assert(isPlainObject(pluginManifest.manifestKeyMap))
  assert(
    pluginManifest.baseAssets === null ||
      (typeof pluginManifest.baseAssets === 'string' && pluginManifest.baseAssets.startsWith('http'))
  )
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `You need to re-build your app (\`$ vite build\`). (Because you are using \`vite-plugin-ssr@${projectInfo.projectVersion}\` while your build has been generated with a different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`
  )
}
