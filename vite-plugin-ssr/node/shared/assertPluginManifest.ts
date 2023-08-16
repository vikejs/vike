export { assertPluginManifest }
export type { PluginManifest }

import { assertRuntimeManifest } from './assertRuntimeManifest.js'
import {
  assert,
  assertUsage,
  isPlainObject,
  projectInfo,
  checkType,
  hasProp,
  isStringRecord,
  objectAssign
} from './utils.js'

type PluginManifest = {
  version: string
  baseServer: string
  baseAssets: string | null
  usesClientRouter: boolean
  includeAssetsImportedByServer: boolean
  manifestKeyMap: Record<string, string>
  redirects: Record<string, string>
}
function assertPluginManifest(pluginManifest: unknown): asserts pluginManifest is PluginManifest {
  assert(isPlainObject(pluginManifest))
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Re-build your app (you're using vite-plugin-ssr@${projectInfo.projectVersion} but your app was built with vite-plugin-ssr@${pluginManifest.version})`
  )
  assertRuntimeManifest(pluginManifest)
  assert(hasProp(pluginManifest, 'usesClientRouter', 'boolean'))
  assert(hasProp(pluginManifest, 'version', 'string'))
  assert(hasProp(pluginManifest, 'manifestKeyMap', 'object'))
  const { manifestKeyMap } = pluginManifest
  assert(isStringRecord(manifestKeyMap))
  // Avoid:
  // ```
  // Uncaught (in promise) TypeError: Cannot set property manifestKeyMap of #<Object> which has only a getter
  // ```
  // See https://github.com/brillout/vite-plugin-ssr/issues/596
  const pluginManifestClone = { ...pluginManifest }
  objectAssign(pluginManifestClone, { manifestKeyMap })
  checkType<PluginManifest>(pluginManifestClone)
}
