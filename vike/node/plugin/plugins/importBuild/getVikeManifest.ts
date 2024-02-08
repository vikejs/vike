export { getVikeManifest }

import { projectInfo } from '../../utils.js'
import { type PluginManifest, assertPluginManifest } from '../../../shared/assertPluginManifest.js'
import { isUsingClientRouter } from '../extractExportNamesPlugin.js'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { getRuntimeManifest } from '../../../runtime/globalContext.js'

function getVikeManifest(configVike: ConfigVikeResolved): PluginManifest {
  const runtimeManifest = getRuntimeManifest(configVike)
  const manifest = {
    version: projectInfo.projectVersion,
    usesClientRouter: isUsingClientRouter(), // TODO/v1-release: remove
    ...runtimeManifest
  }
  assertPluginManifest(manifest)
  return manifest
}
