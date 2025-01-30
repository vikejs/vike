export { assertPluginManifest }
export type { PluginManifest }

import { assertRuntimeManifest, type RuntimeManifest } from './assertRuntimeManifest.js'
import { assert, assertUsage, isPlainObject, projectInfo, checkType, hasProp } from './utils.js'

type PluginManifest = RuntimeManifest & {
  version: string
  usesClientRouter: boolean
}
function assertPluginManifest(pluginManifest: unknown): asserts pluginManifest is PluginManifest {
  assert(isPlainObject(pluginManifest))
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Re-build your app (you're using vike@${projectInfo.projectVersion} but your app was built with vike@${pluginManifest.version})`
  )
  assertRuntimeManifest(pluginManifest)
  assert(hasProp(pluginManifest, 'usesClientRouter', 'boolean'))
  assert(hasProp(pluginManifest, 'version', 'string'))
  // Avoid:
  // ```
  // Uncaught (in promise) TypeError: Cannot set property manifestKeyMap of #<Object> which has only a getter
  // ```
  // We removed manifestKeyMap, maybe this isn't needed anymore.
  // See https://github.com/vikejs/vike/issues/596
  const pluginManifestClone = { ...pluginManifest }
  checkType<PluginManifest>(pluginManifestClone)
}
