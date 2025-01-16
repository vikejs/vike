export { getVikeManifest }

import { projectInfo } from '../../utils.js'
import { type PluginManifest, assertPluginManifest } from '../../../shared/assertPluginManifest.js'
import { isUsingClientRouter } from '../extractExportNamesPlugin.js'
import type { ConfigVikeResolved } from '../importUserCode/v1-design/getVikeConfig/resolveVikeConfigGlobal.js'
import { getRuntimeManifest } from '../../../runtime/globalContext.js'
import type { ResolvedConfig } from 'vite'

function getVikeManifest(configVike: ConfigVikeResolved, viteConfig: ResolvedConfig): PluginManifest {
  const runtimeManifest = getRuntimeManifest(configVike, viteConfig)
  const manifest = {
    version: projectInfo.projectVersion,
    usesClientRouter: isUsingClientRouter(), // TODO/v1-release: remove
    ...runtimeManifest
  }
  assertPluginManifest(manifest)
  return manifest
}
