export { getVikeManifest }

import { projectInfo } from '../../utils'
import { type PluginManifest, assertPluginManifest } from '../../../shared/assertPluginManifest'
import { isUsingClientRouter } from '../extractExportNamesPlugin'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike'
import { getRuntimeManifest } from '../../../runtime/globalContext'

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
