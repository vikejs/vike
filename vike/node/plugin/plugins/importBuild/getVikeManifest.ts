export { getVikeManifest }

import { ResolvedConfig } from 'vite'
import { projectInfo, toPosixPath, assertPosixPath, isNotNullish } from '../../utils.js'
import { type PluginManifest, assertPluginManifest } from '../../../shared/assertPluginManifest.js'
import { isUsingClientRouter } from '../extractExportNamesPlugin.js'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import path from 'path'
import { getRuntimeManifest } from '../../../runtime/globalContext.js'

function getVikeManifest(config: ResolvedConfig, configVike: ConfigVikeResolved): PluginManifest {
  const runtimeManifest = getRuntimeManifest(configVike)
  const manifest = {
    version: projectInfo.projectVersion,
    usesClientRouter: isUsingClientRouter(), // TODO/v1-release: remove
    manifestKeyMap: getManifestKeyMap(configVike, config),
    ...runtimeManifest
  }
  assertPluginManifest(manifest)
  return manifest
}

function getManifestKeyMap(configVike: ConfigVikeResolved, config: ResolvedConfig): Record<string, string> {
  const manifestKeyMap: Record<string, string> = {}
  configVike.extensions
    .map(({ pageConfigsDistFiles }) => pageConfigsDistFiles)
    .flat()
    .filter(isNotNullish)
    .forEach(({ importPath, filePath }) => {
      // Recreating https://github.com/vitejs/vite/blob/8158ece72b66307e7b607b98496891610ca70ea2/packages/vite/src/node/plugins/manifest.ts#L38
      const filePathRelative = path.posix.relative(config.root, toPosixPath(filePath))
      assertPosixPath(filePathRelative)
      assertPosixPath(importPath)
      manifestKeyMap[importPath] = filePathRelative
    })
  return manifestKeyMap
}
