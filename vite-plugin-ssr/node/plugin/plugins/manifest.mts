export { manifest }

import { Plugin, ResolvedConfig } from 'vite'
import { projectInfo, viteIsSSR, toPosixPath, assertPosixPath, isNotNullish } from '../utils.mjs'
import { assertPluginManifest } from '../../shared/assertPluginManifest.mjs'
import { isUsingClientRouter } from './extractExportNamesPlugin.mjs'
import { getConfigVps } from '../../shared/getConfigVps.mjs'
import type { ConfigVpsResolved } from '../../../shared/ConfigVps.mjs'
import path from 'path'
import { getRuntimeManifest } from '../../runtime/globalContext.mjs'

function manifest(): Plugin[] {
  let configVps: ConfigVpsResolved
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:pluginManifest',
      apply: 'build',
      async configResolved(config_: ResolvedConfig) {
        config = config_
        configVps = await getConfigVps(config)
      },
      generateBundle() {
        if (viteIsSSR(config)) return
        const runtimeManifest = getRuntimeManifest(configVps)
        const manifest = {
          version: projectInfo.projectVersion,
          usesClientRouter: isUsingClientRouter(), // TODO/v1-release: remove
          manifestKeyMap: getManifestKeyMap(configVps, config),
          ...runtimeManifest
        }
        assertPluginManifest(manifest)
        this.emitFile({
          fileName: `vite-plugin-ssr.json`,
          type: 'asset',
          source: JSON.stringify(manifest, null, 2)
        })
      }
    }
  ]
}

function getManifestKeyMap(configVps: ConfigVpsResolved, config: ResolvedConfig): Record<string, string> {
  const manifestKeyMap: Record<string, string> = {}
  configVps.extensions
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
