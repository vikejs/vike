export { manifest }

import { Plugin, ResolvedConfig } from 'vite'
import { projectInfo, viteIsSSR, toPosixPath, assertPosixPath, isNotNullish } from '../utils'
import { assertPluginManifest } from './manifest/assertPluginManifest'
import { isUsingClientRouter } from './extractExportNamesPlugin'
import { getConfigVps } from './config/getConfigVps'
import type { ConfigVpsResolved } from '../../shared/ConfigVps'
import path from 'path'
import { getRuntimeManifest } from '../../runtime/globalContext'

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
          usesClientRouter: isUsingClientRouter(),
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
    .map(({ pageFilesDist }) => pageFilesDist)
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
