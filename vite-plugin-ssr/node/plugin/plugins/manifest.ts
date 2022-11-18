export { manifest }

import { Plugin, ResolvedConfig } from 'vite'
import { assert, projectInfo, viteIsSSR, toPosixPath, assertPosixPath } from '../utils'
import { apply } from '../helpers'
import { assertPluginManifest } from './manifest/assertPluginManifest'
import { setRuntimeConfig, RuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { isUsingClientRouter } from './extractExportNamesPlugin'
import { getConfigVps } from './config/assertConfigVps'
import { ConfigVpsResolved } from './config/ConfigVps'
import path from 'path'

function manifest(): Plugin[] {
  let ssr: boolean
  let configVps: ConfigVpsResolved
  let config: ResolvedConfig
  let runtimeConfig: RuntimeConfig
  return [
    {
      name: 'vite-plugin-ssr:runtimeConfig',
      apply: apply('dev'),
      async configResolved(config) {
        await onConfigResolved(config)
        setRuntimeConfig(runtimeConfig)
      }
    },
    {
      name: 'vite-plugin-ssr:pluginManifest',
      apply: 'build',
      configResolved: onConfigResolved,
      generateBundle() {
        assert(typeof ssr === 'boolean')
        assert(runtimeConfig)
        if (ssr) return
        const manifest = {
          version: projectInfo.projectVersion,
          usesClientRouter: isUsingClientRouter(),
          manifestKeyMap: getManifestKeyMap(configVps, config),
          ...runtimeConfig
        }
        assertPluginManifest(manifest)
        this.emitFile({
          fileName: `vite-plugin-ssr.json`,
          type: 'asset',
          source: JSON.stringify(manifest, null, 2)
        })
      }
    }
  ] as Plugin[]

  async function onConfigResolved(config_: ResolvedConfig) {
    config = config_
    configVps = await getConfigVps(config)
    ssr = viteIsSSR(config)
    runtimeConfig = resolveRuntimeConfig(config, configVps)
  }
}

function getManifestKeyMap(configVps: ConfigVpsResolved, config: ResolvedConfig): Record<string, string> {
  const manifestKeyMap: Record<string, string> = {}
  configVps.pageFiles.addPageFiles.forEach((entry) => {
    // Recreating https://github.com/vitejs/vite/blob/8158ece72b66307e7b607b98496891610ca70ea2/packages/vite/src/node/plugins/manifest.ts#L38
    const key = path.posix.relative(config.root, toPosixPath(require.resolve(entry, { paths: [config.root] })))
    assertPosixPath(key)
    assertPosixPath(entry)
    manifestKeyMap[entry] = key
  })
  return manifestKeyMap
}
